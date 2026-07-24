import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class PesertaRepository {
  async findAll(kegiatanId?: number, search: string = '', limit: number = 10, offset: number = 0) {
    let query = 'SELECT p.*, k.judul as nama_kegiatan FROM peserta p JOIN kegiatan k ON p.kegiatan_id = k.id WHERE 1=1';
    const params: any[] = [];

    if (kegiatanId) {
      query += ' AND p.kegiatan_id = ?';
      params.push(kegiatanId);
    }

    if (search) {
      query += ' AND p.nama LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM peserta p WHERE 1=1';
    const countParams: any[] = [];
    if (kegiatanId) {
      countQuery += ' AND p.kegiatan_id = ?';
      countParams.push(kegiatanId);
    }
    if (search) {
      countQuery += ' AND p.nama LIKE ?';
      countParams.push(`%${search}%`);
    }
    
    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    
    return { data: rows, total: countRows[0].total };
  }

  async findById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT p.*, k.judul as nama_kegiatan FROM peserta p JOIN kegiatan k ON p.kegiatan_id = k.id WHERE p.id = ?',
      [id]
    );
    return rows[0];
  }

  async create(data: any) {
    const { kegiatan_id, nama, email, no_hp } = data;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO peserta (kegiatan_id, nama, email, no_hp) VALUES (?, ?, ?, ?)',
      [kegiatan_id, nama, email, no_hp]
    );
    return result.insertId;
  }

  async update(id: number, data: any) {
    const { kegiatan_id, nama, email, no_hp } = data;
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE peserta SET kegiatan_id=?, nama=?, email=?, no_hp=? WHERE id=?',
      [kegiatan_id, nama, email, no_hp, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM peserta WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
