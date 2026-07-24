"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Endpoint publik: tidak perlu login, digunakan user untuk mengubah password via token
router.post('/apply-reset-password', userController.applyResetPassword);
// Semua route di bawah ini memerlukan role admin
router.use(auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin']));
router.get('/', userController.getAll);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.post('/:id/reset-password', userController.resetPassword);
exports.default = router;
