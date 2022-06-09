const axios = require("axios").default;
const isAbsoluteURL = require("axios/lib/helpers/isAbsoluteURL");
const buildURL = require("axios/lib/helpers/buildURL");
const combineURLs = require("axios/lib/helpers/combineURLs");
const log = require("./log");
const {
  sta: { http: baseURL },
} = require("./settings");

const instance = axios.create({
  baseURL,
  validateStatus: (status) => {
    // accept 409 Conflict as success
    return (status >= 200 && status < 400) || status == 409;
  },
});

function getURL(config) {
  let { url, baseURL, params, paramsSerializer } = config;
  if (baseURL && !isAbsoluteURL(url)) {
    url = combineURLs(baseURL, url);
  }
  return buildURL(url, params, paramsSerializer);
}

instance.interceptors.request.use((request) => {
  const { method } = request;
  log.debug("%s %s", method.toUpperCase(), getURL(request));
  return request;
});

instance.interceptors.response.use((response) => {
  const { status, config } = response;
  const method = config.method.toUpperCase();
  log.debug("%d (%s %s)", status, method, getURL(config));
  return response;
});

["post", "put", "patch"].forEach((method) => {
  axios.defaults.headers[method] = {
    "Content-Type": "application/json",
  };
});
module.exports = instance;
