import express from 'express';
import { addProduct, getAllProducts } from '../controllers/adminController';
const adminRoutes = express.Router();

//Use adminAuthMiddleware to protect admin routes
adminRoutes.post('/products',  addProduct);
adminRoutes.get('/getAllProducts',  getAllProducts);

// adminRoutes.get('/orders', adminAuthMiddleware, getOrders);
// adminRoutes.post('/orders/respond', adminAuthMiddleware, respondToOrder);

export default adminRoutes;
