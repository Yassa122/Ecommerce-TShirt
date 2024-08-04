"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRoutes = express_1.default.Router();
console.log('Registering /products route');
userRoutes.get('/products', userController_1.getProducts);
userRoutes.get('/products/:id', userController_1.getProductById);
userRoutes.post('/cart', userController_1.addToCart);
userRoutes.post('/checkout', userController_1.checkout);
exports.default = userRoutes;
