import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const userController = new UserController();

// Endpoint publik: tidak perlu login
router.post('/forgot-password', userController.forgotPassword);
router.post('/apply-reset-password', userController.applyResetPassword);
router.get('/verify-reset-token/:token', userController.verifyResetToken);

// Semua route di bawah ini memerlukan role admin
router.use(authenticateJWT, requireRole(['admin']));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.post('/:id/reset-password', userController.resetPassword);

export default router;
