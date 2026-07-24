import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const requireRole = (roles: Array<'admin' | 'operator' | 'viewer'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};
