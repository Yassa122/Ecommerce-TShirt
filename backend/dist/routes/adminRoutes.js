"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminRoutes = express_1.default.Router();
//Use adminAuthMiddleware to protect admin routes
adminRoutes.post('/products', adminController_1.addProduct);
adminRoutes.get('/getAllProducts', adminController_1.getAllProducts);
adminRoutes.put('/updateProduct', adminController_1.editProduct);
adminRoutes.delete('/deleteProduct/:id', adminController_1.deleteProduct);
adminRoutes.get('/product/:id', adminController_1.getProductById);
// adminRoutes.get('/orders', adminAuthMiddleware, getOrders);
// adminRoutes.post('/orders/respond', adminAuthMiddleware, respondToOrder);
exports.default = adminRoutes;
