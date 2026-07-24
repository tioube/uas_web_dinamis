import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class KegiatanRepository {
  async findAll(search: string = '', statusFilter: string = '', jenisFilter: string = '', limit: number = 10, offset: number = 0) {
    let query = 'SELECT k.*, j.nama_jenis FROM kegiatan k JOIN jenis_kegiatan j ON k.jenis_kegiatan_id = j.id WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND k.judul LIKE ?';
      params.push(`%${search}%`);
    }

    if (statusFilter) {
      query += ' AND k.status = ?';
      params.push(statusFilter);
    }
    
    if (jenisFilter && !isNaN(Number(jenisFilter))) {
      query += ' AND k.jenis_kegiatan_id = ?';
      params.push(Number(jenisFilter));
    }

    query += ' ORDER BY k.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM kegiatan k WHERE 1=1';
    const countParams: any[] = [];
    if (search) {
      countQuery += ' AND k.judul LIKE ?';
      countParams.push(`%${search}%`);
    }
    if (statusFilter) {
      countQuery += ' AND k.status = ?';
      countParams.push(statusFilter);
    }
    if (jenisFilter && !isNaN(Number(jenisFilter))) {
      countQuery += ' AND k.jenis_kegiatan_id = ?';
      countParams.push(Number(jenisFilter));
    }
    
    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    
    return { data: rows, total: countRows[0].total };
  }

  async findById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT k.*, j.nama_jenis FROM kegiatan k JOIN jenis_kegiatan j ON k.jenis_kegiatan_id = j.id WHERE k.id = ?',
      [id]
    );
    return rows[0];
  }

  async create(data: any) {
    const { judul, jenis_kegiatan_id, tanggal, lokasi, status, poster } = data;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO kegiatan (judul, jenis_kegiatan_id, tanggal, lokasi, status, poster) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, jenis_kegiatan_id, tanggal, lokasi, status || 'aktif', poster || null]
    );
    return result.insertId;
  }

  async update(id: number, data: any) {
    const { judul, jenis_kegiatan_id, tanggal, lokasi, status } = data;
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE kegiatan SET judul=?, jenis_kegiatan_id=?, tanggal=?, lokasi=?, status=? WHERE id=?',
      [judul, jenis_kegiatan_id, tanggal, lokasi, status, id]
    );
    return result.affectedRows > 0;
  }
  
  async updatePoster(id: number, poster: string) {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE kegiatan SET poster=? WHERE id=?',
      [poster, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM kegiatan WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
