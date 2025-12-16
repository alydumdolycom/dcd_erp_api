import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  // If EU region:
  // url: "https://api.eu.mailgun.net"
});
