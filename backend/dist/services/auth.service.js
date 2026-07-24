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
exports.AuthService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    login(email, passwordString) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }
            const isValidPassword = yield bcrypt_1.default.compare(passwordString, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, nama: user.nama, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return { token, user: { id: user.id, nama: user.nama, email: user.email, role: user.role } };
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nama, email, password, role } = data;
            // Check if email exists
            const existingUser = yield this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('Email already exists');
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const userId = yield this.userRepository.create({
                nama,
                email,
                password: hashedPassword,
                role: role || 'viewer' // Default role
            });
            return userId;
        });
    }
}
exports.AuthService = AuthService;
