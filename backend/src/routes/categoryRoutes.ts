import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory } from '../controllers/categoryController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Pública
router.get('/categories', getCategories);

// Admin
router.post('/admin/categories', authenticate, requireRole('ADMINISTRADOR'), createCategory);
router.put('/admin/categories/:id', authenticate, requireRole('ADMINISTRADOR'), updateCategory);
router.delete('/admin/categories/:id', authenticate, requireRole('ADMINISTRADOR'), deleteCategory);

router.post('/admin/subcategories', authenticate, requireRole('ADMINISTRADOR'), createSubcategory);
router.put('/admin/subcategories/:id', authenticate, requireRole('ADMINISTRADOR'), updateSubcategory);
router.delete('/admin/subcategories/:id', authenticate, requireRole('ADMINISTRADOR'), deleteSubcategory);

export default router;
