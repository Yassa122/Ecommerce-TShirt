import express from 'express';
import { addProduct, deleteProduct, editProduct, getAllOrders, getAllProducts, getProductById } from '../controllers/adminController';
const adminRoutes = express.Router();

//Use adminAuthMiddleware to protect admin routes
adminRoutes.post('/products',  addProduct);
adminRoutes.get('/getAllProducts',  getAllProducts);
adminRoutes.put('/updateProduct',  editProduct);
adminRoutes.delete('/deleteProduct/:id',  deleteProduct);
adminRoutes.get('/product/:id',  getProductById);
adminRoutes.get('/orders',  getAllOrders);

// adminRoutes.get('/orders', adminAuthMiddleware, getOrders);
// adminRoutes.post('/orders/respond', adminAuthMiddleware, respondToOrder);

export default adminRoutes;
