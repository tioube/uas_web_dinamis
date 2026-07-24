"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kegiatan_controller_1 = require("../controllers/kegiatan.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const kegiatanController = new kegiatan_controller_1.KegiatanController();
router.get('/', auth_middleware_1.authenticateJWT, kegiatanController.getAll);
router.get('/:id', auth_middleware_1.authenticateJWT, kegiatanController.getById);
// Admin and Operator can create, update
router.post('/', auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin', 'operator']), kegiatanController.create);
router.put('/:id', auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin', 'operator']), kegiatanController.update);
router.post('/:id/upload', auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin', 'operator']), upload_middleware_1.upload.single('poster'), kegiatanController.uploadPoster);
// Only Admin can delete
router.delete('/:id', auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin']), kegiatanController.delete);
exports.default = router;
