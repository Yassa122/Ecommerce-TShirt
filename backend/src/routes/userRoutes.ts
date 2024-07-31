import express from 'express';
import { addToCart, checkout, getProductById, getProducts } from '../controllers/userController';

const userRoutes = express.Router();

console.log('Registering /products route');

userRoutes.get('/products', getProducts);
userRoutes.get('/products/:id', getProductById);
userRoutes.post('/cart', addToCart);
userRoutes.post('/checkout', checkout);

export default userRoutes;
