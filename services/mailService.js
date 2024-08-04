const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'your-email-service',
  auth: {
    user: 'your-email@example.com',
    pass: 'your-email-password',
  },
});

function sendMail(to, subject, text) {
  const mailOptions = {
    from: 'your-email@example.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${to}:`, error);
    } else {
      console.log(`Email sent to ${to}:`, info.response);
    }
  });
}

module.exports = {
  sendMail,
};
