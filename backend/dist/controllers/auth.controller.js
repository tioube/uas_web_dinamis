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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor() {
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.authService.login(email, password);
                res.json({
                    status: 'success',
                    data: result
                });
            }
            catch (error) {
                if (error.message === 'Invalid email or password') {
                    res.status(401).json({ status: 'error', message: error.message });
                }
                else {
                    next(error);
                }
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield this.authService.register(req.body);
                res.status(201).json({
                    status: 'success',
                    message: 'User registered successfully',
                    data: { id: userId }
                });
            }
            catch (error) {
                if (error.message === 'Email already exists') {
                    res.status(400).json({ status: 'error', message: error.message });
                }
                else {
                    next(error);
                }
            }
        });
        this.me = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.json({
                    status: 'success',
                    data: { user: req.user }
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // In JWT, logout is usually handled client-side by deleting the token.
                // But we provide this endpoint to fulfill the requirement.
                res.json({
                    status: 'success',
                    message: 'Logged out successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
