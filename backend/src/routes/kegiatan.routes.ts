import { Router } from 'express';
import { KegiatanController } from '../controllers/kegiatan.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();
const kegiatanController = new KegiatanController();

router.get('/', authenticateJWT, kegiatanController.getAll);
router.get('/:id', authenticateJWT, kegiatanController.getById);

// Admin and Operator can create, update
router.post('/', authenticateJWT, requireRole(['admin', 'operator']), kegiatanController.create);
router.put('/:id', authenticateJWT, requireRole(['admin', 'operator']), kegiatanController.update);
router.post('/:id/upload', authenticateJWT, requireRole(['admin', 'operator']), upload.single('poster'), kegiatanController.uploadPoster);

// Only Admin can delete
router.delete('/:id', authenticateJWT, requireRole(['admin']), kegiatanController.delete);

export default router;
