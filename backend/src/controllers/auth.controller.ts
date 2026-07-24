import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json({
        status: 'success',
        data: result
      });
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({ status: 'error', message: error.message });
      } else {
        next(error);
      }
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = await this.authService.register(req.body);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: { id: userId }
      });
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        res.status(400).json({ status: 'error', message: error.message });
      } else {
        next(error);
      }
    }
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({
        status: 'success',
        data: { user: req.user }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In JWT, logout is usually handled client-side by deleting the token.
      // But we provide this endpoint to fulfill the requirement.
      res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
