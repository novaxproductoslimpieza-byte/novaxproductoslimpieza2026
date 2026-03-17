import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/orderController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.post('/orders', authenticate, createOrder);
router.get('/orders', authenticate, getOrders);
router.get('/admin/orders/:id', authenticate, requireRole('ADMINISTRADOR'), getOrderById);
router.delete('/orders/:id', authenticate, deleteOrder);
router.put('/admin/orders/:id/status', authenticate, requireRole('ADMINISTRADOR'), updateOrderStatus);

export default router;

