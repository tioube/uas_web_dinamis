"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class KegiatanRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (search = '', filter = '', limit = 10, offset = 0) {
            let query = 'SELECT k.*, j.nama_jenis FROM kegiatan k JOIN jenis_kegiatan j ON k.jenis_kegiatan_id = j.id WHERE 1=1';
            const params = [];
            if (search) {
                query += ' AND k.judul LIKE ?';
                params.push(`%${search}%`);
            }
            if (filter) {
                // filter bisa berupa id jenis_kegiatan atau status
                if (['aktif', 'selesai', 'batal'].includes(filter)) {
                    query += ' AND k.status = ?';
                    params.push(filter);
                }
                else if (!isNaN(Number(filter))) {
                    query += ' AND k.jenis_kegiatan_id = ?';
                    params.push(Number(filter));
                }
            }
            query += ' ORDER BY k.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);
            const [rows] = yield database_1.default.query(query, params);
            // Get total count for pagination
            let countQuery = 'SELECT COUNT(*) as total FROM kegiatan k WHERE 1=1';
            const countParams = [];
            if (search) {
                countQuery += ' AND k.judul LIKE ?';
                countParams.push(`%${search}%`);
            }
            if (filter) {
                if (['aktif', 'selesai', 'batal'].includes(filter)) {
                    countQuery += ' AND k.status = ?';
                    countParams.push(filter);
                }
                else if (!isNaN(Number(filter))) {
                    countQuery += ' AND k.jenis_kegiatan_id = ?';
                    countParams.push(Number(filter));
                }
            }
            const [countRows] = yield database_1.default.query(countQuery, countParams);
            return { data: rows, total: countRows[0].total };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT k.*, j.nama_jenis FROM kegiatan k JOIN jenis_kegiatan j ON k.jenis_kegiatan_id = j.id WHERE k.id = ?', [id]);
            return rows[0];
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { judul, jenis_kegiatan_id, tanggal, lokasi, status, poster } = data;
            const [result] = yield database_1.default.query('INSERT INTO kegiatan (judul, jenis_kegiatan_id, tanggal, lokasi, status, poster) VALUES (?, ?, ?, ?, ?, ?)', [judul, jenis_kegiatan_id, tanggal, lokasi, status || 'aktif', poster || null]);
            return result.insertId;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { judul, jenis_kegiatan_id, tanggal, lokasi, status } = data;
            const [result] = yield database_1.default.query('UPDATE kegiatan SET judul=?, jenis_kegiatan_id=?, tanggal=?, lokasi=?, status=? WHERE id=?', [judul, jenis_kegiatan_id, tanggal, lokasi, status, id]);
            return result.affectedRows > 0;
        });
    }
    updatePoster(id, poster) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('UPDATE kegiatan SET poster=? WHERE id=?', [poster, id]);
            return result.affectedRows > 0;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('DELETE FROM kegiatan WHERE id = ?', [id]);
            return result.affectedRows > 0;
        });
    }
}
exports.KegiatanRepository = KegiatanRepository;
