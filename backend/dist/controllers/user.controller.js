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
exports.UserController = void 0;
const user_repository_1 = require("../repositories/user.repository");
const mailer_1 = require("../utils/mailer");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    constructor() {
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.userRepository.findAll();
                res.json({ status: 'success', data });
            }
            catch (error) {
                next(error);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(req.body.password || 'password123', 10);
                const id = yield this.userRepository.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
                res.status(201).json({ status: 'success', message: 'User created', data: { id } });
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.userRepository.update(id, req.body);
                if (!success) {
                    return res.status(404).json({ status: 'error', message: 'User not found' });
                }
                res.json({ status: 'success', message: 'User updated' });
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield this.userRepository.delete(id);
                if (!success) {
                    return res.status(404).json({ status: 'error', message: 'User not found' });
                }
                res.json({ status: 'success', message: 'User deleted' });
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Step 1: Admin meminta reset password untuk user tertentu.
         * Akan generate token dan mengirimkan ke email user.
         */
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const user = yield this.userRepository.findById(id);
                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'User not found' });
                }
                const resetToken = crypto_1.default.randomBytes(32).toString('hex');
                const expiredAt = new Date(Date.now() + 3600000); // 1 jam
                yield this.userRepository.setResetToken(id, resetToken, expiredAt);
                try {
                    yield (0, mailer_1.sendResetPasswordEmail)(user.email, resetToken);
                }
                catch (e) {
                    console.warn('Failed to send email. Please configure SMTP in .env');
                }
                res.json({
                    status: 'success',
                    message: 'Password reset token generated. Token sent to user email.',
                    data: {
                        resetToken, // Disertakan untuk keperluan testing jika SMTP belum dikonfigurasi
                        note: 'Gunakan token ini di endpoint POST /api/users/apply-reset-password'
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Step 2: User menggunakan token untuk menetapkan password baru.
         * Endpoint ini TIDAK memerlukan autentikasi JWT (akses publik).
         * Body: { token: string, new_password: string }
         */
        this.applyResetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, new_password } = req.body;
                if (!token || !new_password) {
                    return res.status(400).json({ status: 'error', message: 'Token dan new_password wajib diisi' });
                }
                const user = yield this.userRepository.findByResetToken(token);
                if (!user) {
                    return res.status(400).json({ status: 'error', message: 'Token tidak valid atau sudah digunakan' });
                }
                // Cek apakah token sudah expired
                const now = new Date();
                const tokenExpiry = new Date(user.reset_token_expired_at);
                if (now > tokenExpiry) {
                    return res.status(400).json({ status: 'error', message: 'Token sudah expired. Minta reset password ulang.' });
                }
                // Hash password baru dan hapus token
                const hashedPassword = yield bcrypt_1.default.hash(new_password, 10);
                yield this.userRepository.updatePasswordAndClearToken(user.id, hashedPassword);
                res.json({ status: 'success', message: 'Password berhasil diubah. Silakan login dengan password baru.' });
            }
            catch (error) {
                next(error);
            }
        });
        this.userRepository = new user_repository_1.UserRepository();
    }
}
exports.UserController = UserController;
