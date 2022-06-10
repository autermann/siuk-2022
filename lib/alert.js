const nodemailer = require("nodemailer");
const log = require("./log");
const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
  MAIL_TO,
} = process.env;

const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE === "true",
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});

async function sendMail(subject, text) {
  let info = await transport.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: subject,
    text: text,
    html: `<p>${text}</p>`,
  });
  log.info(info);
}

async function checkThreshold(
  observation,
  { lower = undefined, upper = undefined }
) {
  if (lower !== undefined && lower > observation.result) {
    await this.sendMail("Value below threshold", observation.toString());
  }
  if (upper !== undefined && upper < observation.result) {
    await sendMail("Value above threshold", observation.toString());
  }
}

module.exports = { sendMail, checkThreshold };
