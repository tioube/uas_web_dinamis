import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class UserRepository {
  async findByEmail(email: string) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  async create(user: any) {
    const { nama, email, password, role } = user;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, password, role]
    );
    return result.insertId;
  }

  async findAll() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, nama, email, role, created_at, updated_at FROM users');
    return rows;
  }

  async findById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, nama, email, role, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async update(id: number, user: any) {
    const { nama, email, role } = user;
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET nama=?, email=?, role=? WHERE id=?',
      [nama, email, role, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async setResetToken(id: number, token: string, expiredAt: Date) {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET reset_token=?, reset_token_expired_at=? WHERE id=?',
      [token, expiredAt, id]
    );
    return result.affectedRows > 0;
  }

  async findByResetToken(token: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, nama, email, role, reset_token_expired_at FROM users WHERE reset_token = ?',
      [token]
    );
    return rows[0];
  }

  async updatePasswordAndClearToken(id: number, hashedPassword: string) {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET password=?, reset_token=NULL, reset_token_expired_at=NULL WHERE id=?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }
}

