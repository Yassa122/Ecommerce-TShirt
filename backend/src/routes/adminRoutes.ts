import express from 'express';
import { addPhoto, addProduct, deletePhoto, deleteProduct, editProduct, getAllOrders, getAllPhotos, getAllProducts, getProductById } from '../controllers/adminController';
const adminRoutes = express.Router();

//Use adminAuthMiddleware to protect admin routes
adminRoutes.post('/products',  addProduct);
adminRoutes.get('/getAllProducts',  getAllProducts);
adminRoutes.put('/updateProduct',  editProduct);
adminRoutes.delete('/deleteProduct/:id',  deleteProduct);
adminRoutes.get('/product/:id',  getProductById);
adminRoutes.get('/orders',  getAllOrders);
adminRoutes.put('/editProduct/:id',  editProduct);
adminRoutes.post('/addPhoto',  addPhoto);
adminRoutes.delete('/deletePhoto/:id',  deletePhoto);
adminRoutes.get("/getAllPhotos", getAllPhotos);


// adminRoutes.get('/orders', adminAuthMiddleware, getOrders);
// adminRoutes.post('/orders/respond', adminAuthMiddleware, respondToOrder);

export default adminRoutes;
