import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { sendResetPasswordEmail } from '../utils/mailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userRepository.findAll();
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await this.userRepository.findById(id);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password || 'password123', 10);
      const id = await this.userRepository.create({ ...req.body, password: hashedPassword });
      res.status(201).json({ status: 'success', message: 'User created', data: { id } });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await this.userRepository.update(id, req.body);
      if (!success) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
      res.json({ status: 'success', message: 'User updated' });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await this.userRepository.delete(id);
      if (!success) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
      res.json({ status: 'success', message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Step 1: Admin meminta reset password untuk user tertentu.
   * Akan generate token dan mengirimkan ke email user.
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const user = await this.userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiredAt = new Date(Date.now() + 3600000); // 1 jam

      await this.userRepository.setResetToken(id, resetToken, expiredAt);

      try {
        await sendResetPasswordEmail(user.email, resetToken);
      } catch (e) {
        console.warn('Failed to send email. Please configure SMTP in .env');
      }

      res.json({
        status: 'success',
        message: 'Password reset token generated. Token sent to user email.',
        data: {
          resetToken, // Disertakan untuk keperluan testing jika SMTP belum dikonfigurasi
          note: 'Gunakan token ini di endpoint POST /api/users/apply-reset-password'
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Step 1 (Public): User lupa password dan meminta link reset via email.
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email wajib diisi' });
      }

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        // Demi keamanan, sebaiknya kita tetap kembalikan status success meskipun email tidak ada.
        // Tapi untuk mempermudah tugas, kita akan memunculkan pesan error.
        return res.status(404).json({ status: 'error', message: 'Email tidak terdaftar' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiredAt = new Date(Date.now() + 3600000); // 1 jam

      await this.userRepository.setResetToken(user.id, resetToken, expiredAt);

      try {
        await sendResetPasswordEmail(user.email, resetToken);
      } catch (e) {
        console.warn('Failed to send email. Please configure SMTP in .env');
      }

      res.json({
        status: 'success',
        message: 'Link reset password telah dikirim ke email Anda.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Step 2: User menggunakan token untuk menetapkan password baru.
   * Endpoint ini TIDAK memerlukan autentikasi JWT (akses publik).
   * Body: { token: string, new_password: string }
   */
  applyResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, new_password } = req.body;

      if (!token || !new_password) {
        return res.status(400).json({ status: 'error', message: 'Token dan new_password wajib diisi' });
      }

      const user = await this.userRepository.findByResetToken(token);

      if (!user) {
        return res.status(400).json({ status: 'error', message: 'Token tidak valid atau sudah digunakan' });
      }

      // Cek apakah token sudah expired
      const now = new Date();
      const tokenExpiry = new Date(user.reset_token_expired_at);
      if (now > tokenExpiry) {
        return res.status(400).json({ status: 'error', message: 'Token sudah expired. Minta reset password ulang.' });
      }

      // Hash password baru dan hapus token
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await this.userRepository.updatePasswordAndClearToken(user.id, hashedPassword);

      res.json({ status: 'success', message: 'Password berhasil diubah. Silakan login dengan password baru.' });
    } catch (error) {
      next(error);
    }
  };
}

