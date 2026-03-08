import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateStock } from '../controllers/productController';
import { authenticate, optionalAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Rutas públicas (con precios opcionales según auth)
router.get('/products', optionalAuth, getProducts);
router.get('/products/:id', optionalAuth, getProductById);

// Rutas admin
router.post('/admin/products', authenticate, requireRole('ADMINISTRADOR'), createProduct);
router.put('/admin/products/:id', authenticate, requireRole('ADMINISTRADOR'), updateProduct);
router.delete('/admin/products/:id', authenticate, requireRole('ADMINISTRADOR'), deleteProduct);
router.patch('/admin/products/:id/stock', authenticate, requireRole('ADMINISTRADOR'), updateStock);

export default router;
