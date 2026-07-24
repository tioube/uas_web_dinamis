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
exports.PesertaRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class PesertaRepository {
    findAll(kegiatanId_1) {
        return __awaiter(this, arguments, void 0, function* (kegiatanId, search = '', limit = 10, offset = 0) {
            let query = 'SELECT p.*, k.judul as nama_kegiatan FROM peserta p JOIN kegiatan k ON p.kegiatan_id = k.id WHERE 1=1';
            const params = [];
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
            const [rows] = yield database_1.default.query(query, params);
            // Get total count for pagination
            let countQuery = 'SELECT COUNT(*) as total FROM peserta p WHERE 1=1';
            const countParams = [];
            if (kegiatanId) {
                countQuery += ' AND p.kegiatan_id = ?';
                countParams.push(kegiatanId);
            }
            if (search) {
                countQuery += ' AND p.nama LIKE ?';
                countParams.push(`%${search}%`);
            }
            const [countRows] = yield database_1.default.query(countQuery, countParams);
            return { data: rows, total: countRows[0].total };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT p.*, k.judul as nama_kegiatan FROM peserta p JOIN kegiatan k ON p.kegiatan_id = k.id WHERE p.id = ?', [id]);
            return rows[0];
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { kegiatan_id, nama, email, no_hp } = data;
            const [result] = yield database_1.default.query('INSERT INTO peserta (kegiatan_id, nama, email, no_hp) VALUES (?, ?, ?, ?)', [kegiatan_id, nama, email, no_hp]);
            return result.insertId;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { kegiatan_id, nama, email, no_hp } = data;
            const [result] = yield database_1.default.query('UPDATE peserta SET kegiatan_id=?, nama=?, email=?, no_hp=? WHERE id=?', [kegiatan_id, nama, email, no_hp, id]);
            return result.affectedRows > 0;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('DELETE FROM peserta WHERE id = ?', [id]);
            return result.affectedRows > 0;
        });
    }
}
exports.PesertaRepository = PesertaRepository;
