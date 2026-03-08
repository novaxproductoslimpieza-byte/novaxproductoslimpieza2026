import { Router } from 'express';
import { getProfile, updateProfile, getClients } from '../controllers/userController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/users/profile', authenticate, getProfile);
router.put('/users/profile', authenticate, updateProfile);
router.get('/admin/clients', authenticate, requireRole('ADMINISTRADOR'), getClients);

export default router;
