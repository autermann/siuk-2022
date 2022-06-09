FROM nginx:alpine

RUN apk add --no-cache gettext

COPY upstream.conf /etc/nginx/upstream.conf.template
COPY nginx.conf proxy.conf /etc/nginx/

CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/upstream.conf.template > /etc/nginx/upstream.conf && exec nginx -g 'daemon off;'"]