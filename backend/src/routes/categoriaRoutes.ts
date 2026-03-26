import { Router } from 'express';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoriaController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Admin protegido
router.get('/admin/categoria', authenticate, requireRole('ADMINISTRADOR'), getCategorias);
router.post('/admin/categoria', authenticate, requireRole('ADMINISTRADOR'), createCategoria);
router.put('/admin/categoria/:id', authenticate, requireRole('ADMINISTRADOR'), updateCategoria);
router.delete('/admin/categoria/:id', authenticate, requireRole('ADMINISTRADOR'), deleteCategoria);

export default router;