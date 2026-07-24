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
exports.UserRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nama, email, password, role } = user;
            const [result] = yield database_1.default.query('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)', [nama, email, password, role]);
            return result.insertId;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT id, nama, email, role, created_at, updated_at FROM users');
            return rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT id, nama, email, role, created_at, updated_at FROM users WHERE id = ?', [id]);
            return rows[0];
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nama, email, role } = user;
            const [result] = yield database_1.default.query('UPDATE users SET nama=?, email=?, role=? WHERE id=?', [nama, email, role, id]);
            return result.affectedRows > 0;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('DELETE FROM users WHERE id = ?', [id]);
            return result.affectedRows > 0;
        });
    }
    setResetToken(id, token, expiredAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('UPDATE users SET reset_token=?, reset_token_expired_at=? WHERE id=?', [token, expiredAt, id]);
            return result.affectedRows > 0;
        });
    }
    findByResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query('SELECT id, nama, email, role, reset_token_expired_at FROM users WHERE reset_token = ?', [token]);
            return rows[0];
        });
    }
    updatePasswordAndClearToken(id, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query('UPDATE users SET password=?, reset_token=NULL, reset_token_expired_at=NULL WHERE id=?', [hashedPassword, id]);
            return result.affectedRows > 0;
        });
    }
}
exports.UserRepository = UserRepository;
