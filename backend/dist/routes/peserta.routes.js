"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const peserta_controller_1 = require("../controllers/peserta.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
const pesertaController = new peserta_controller_1.PesertaController();
router.get('/', auth_middleware_1.authenticateJWT, pesertaController.getAll);
router.get('/:id', auth_middleware_1.authenticateJWT, pesertaController.getById);
// Admin and Operator can create, update
router.post('/', auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin', 'operator']), pesertaController.create);
router.put('/:id', auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin', 'operator']), pesertaController.update);
// Only Admin can delete
router.delete('/:id', auth_middleware_1.authenticateJWT, (0, role_middleware_1.requireRole)(['admin']), pesertaController.delete);
exports.default = router;
