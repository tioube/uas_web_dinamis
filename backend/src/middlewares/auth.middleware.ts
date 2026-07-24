import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Token Invalid' });
      }

      req.user = user as UserPayload;
      next();
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Unauthorized: Token Tidak Ditemukan' });
  }
};
