import express from 'express';
import { addToCart, getProductById, getProducts } from '../controllers/userController';

const userRoutes = express.Router();

console.log('Registering /products route');

userRoutes.get('/products', getProducts);
userRoutes.get('/products/:id', getProductById);
userRoutes.post('/cart', addToCart);

export default userRoutes;
