import express from 'express';
import { addProduct } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';

const adminRoutes = express.Router();

//Use adminAuthMiddleware to protect admin routes
adminRoutes.post('/products', authMiddleware, addProduct);
// adminRoutes.get('/orders', adminAuthMiddleware, getOrders);
// adminRoutes.post('/orders/respond', adminAuthMiddleware, respondToOrder);

export default adminRoutes;
