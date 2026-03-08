import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.post('/orders', authenticate, createOrder);
router.get('/orders', authenticate, getOrders);
router.put('/admin/orders/:id/status', authenticate, requireRole('ADMINISTRADOR'), updateOrderStatus);

export default router;
