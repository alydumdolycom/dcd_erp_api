import transporter from '../config/mailConfig.js';

export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: '"DCD ERP" <no-reply@dcd-erp.ro>',
    to,
    subject,
    html
  });
}
