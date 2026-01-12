import nodemailer from 'nodemailer';

try {
   // 1. Configure the transporter with your Mailgun credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org', // Mailgun SMTP hostname
    port: 587,                // Recommended port
    secure: false,            // False for port 587 (uses STARTTLS)
    auth: {
        user: 'brad@sandboxa1f7cdebbcf64ec6b718a3deeed05f22.mailgun.org',
        pass: MAIL_GUN_PASSWORD // Use the password you created in the Mailgun dashboard
    }
});

// 2. Define the email content
const mailOptions = {
    from: '"Your Name" <postmaster@sandboxa1f7cdebbcf64ec6b718a3deeed05f22.mailgun.org>', // Must match your domain
    to: 'adumitru@dolycom.ro', // Replace with your test recipient email
    subject: 'Hello from Node.js and Mailgun',
    text: 'This is a test email sent using Nodemailer and Mailgun SMTP.',
    html: '<b>This is a test email sent using Nodemailer and Mailgun SMTP.</b>'
};

// 3. Send the email
async function send() {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
}

send();
} catch (e) {
    console.error('Unexpected error:', e);
}
