import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAIL_GUN_API_KEY,
  url:
    process.env.MAILGUN_REGION === "eu"
      ? "https://api.eu.mailgun.net"
      : "https://api.mailgun.net"
});
