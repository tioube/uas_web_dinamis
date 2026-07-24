import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: `"Sistem Kampus" <${process.env.SMTP_USER}>`,
    to: to,
    subject: 'Password Reset',
    text: `Anda (atau Admin) baru saja meminta reset password untuk akun Anda.\nSilakan gunakan link berikut untuk membuat password baru:\nhttp://localhost:3001/reset-password?token=${token}`,
    html: `
      <h3>Reset Password</h3>
      <p>Anda (atau Admin) baru saja meminta reset password untuk akun Anda.</p>
      <p>Silakan klik link di bawah ini untuk membuat password baru:</p>
      <p><a href="http://localhost:3001/reset-password?token=${token}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:5px;">Atur Ulang Password</a></p>
      <p>Atau gunakan token ini secara manual: <b>${token}</b></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
