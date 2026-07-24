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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin-top: 0; border-bottom: 1px solid #f3f4f6; padding-bottom: 15px;">Permintaan Reset Password</h2>
          <p style="color: #4b5563; line-height: 1.6;">Halo,</p>
          <p style="color: #4b5563; line-height: 1.6;">Anda (atau Admin) baru saja meminta reset password untuk akun Anda pada <strong>${new Date().toLocaleString('id-ID')}</strong>.</p>
          <p style="color: #4b5563; line-height: 1.6;">Silakan klik tombol di bawah ini untuk mengatur ulang password Anda:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="http://localhost:3001/reset-password?token=${token}" style="display:inline-block;padding:12px 24px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">Atur Ulang Password</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
            Tautan reset password ini hanya berlaku selama 1 jam.<br>
            Jika Anda tidak merasa meminta reset password, Anda dapat mengabaikan email ini dengan aman.
          </p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
