import { Router } from 'express';
import { PesertaController } from '../controllers/peserta.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const pesertaController = new PesertaController();

router.get('/', authenticateJWT, pesertaController.getAll);
router.get('/:id', authenticateJWT, pesertaController.getById);

// Admin and Operator can create, update
router.post('/', authenticateJWT, requireRole(['admin', 'operator']), pesertaController.create);
router.put('/:id', authenticateJWT, requireRole(['admin', 'operator']), pesertaController.update);

// Only Admin can delete
router.delete('/:id', authenticateJWT, requireRole(['admin']), pesertaController.delete);

export default router;
