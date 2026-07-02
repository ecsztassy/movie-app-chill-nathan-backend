const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `http://localhost:3000/api/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Movie App CHILL" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verifikasi Email Kamu',
    html: `
      <h2>Selamat datang di Movie App CHILL!</h2>
      <p>Klik link berikut untuk verifikasi email kamu:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Link ini berlaku 24 jam.</p>
    `,
  });
};

module.exports = { sendVerificationEmail };