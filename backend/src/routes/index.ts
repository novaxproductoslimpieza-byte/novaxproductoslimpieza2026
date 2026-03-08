import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes';
import userRoutes from './userRoutes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'NOVAX API is running', timestamp: new Date() });
});

// Rutas del sistema
router.use('/auth', authRoutes);
router.use('/', categoryRoutes);
router.use('/', productRoutes);
router.use('/', orderRoutes);
router.use('/', userRoutes);

export default router;
