import { Request } from 'express';

export interface UserPayload {
  id: number;
  nama: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
