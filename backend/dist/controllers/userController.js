"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.getCartItems = exports.addToCart = exports.getProductById = exports.getProducts = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const mailer_1 = require("../config/mailer");
const db = firebase_admin_1.default.firestore();
const storage = firebase_admin_1.default.storage().bucket();
// Function to get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsSnapshot = yield db.collection('products').get();
        const products = productsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getProducts = getProducts;
// Function to get a product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productDoc = yield db.collection('products').doc(id).get(); // Ensure the collection name matches exactly
        if (!productDoc.exists) {
            res.status(404).send('Product not found');
        }
        else {
            res.status(200).json(Object.assign({ id: productDoc.id }, productDoc.data()));
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getProductById = getProductById;
// Function to add a product to the cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProductName, ProductId, Quantity, TotalPrice } = req.body;
    const sessionID = req.sessionID;
    if (!sessionID) {
        return res.status(400).send('Session ID is required.');
    }
    try {
        const cartRef = db.collection('Cart').doc(); // Ensure this matches your Firestore collection name
        yield cartRef.set({
            sessionID,
            ProductName,
            ProductId,
            Quantity,
            TotalPrice,
            addedAt: firebase_admin_1.default.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).send(`Product added to cart with ID: ${cartRef.id}`);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.addToCart = addToCart;
// Function to get all items in the cart for a session
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionID = req.sessionID;
    if (!sessionID) {
        return res.status(400).send('Session ID is required.');
    }
    try {
        const cartRef = db.collection('Cart').where('sessionID', '==', sessionID);
        const snapshot = yield cartRef.get();
        const cartItems = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(cartItems);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getCartItems = getCartItems;
// Enable ignoreUndefinedProperties
firebase_admin_1.default.firestore().settings({ ignoreUndefinedProperties: true });
const sendNotification = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_admin_1.default.messaging().send(message);
        console.log('Notification sent successfully');
    }
    catch (error) {
        console.error('Error sending notification:', error);
    }
});
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItems, shippingInfo, deliveryFee } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).send('Cart items are required.');
    }
    try {
        // Create a batch to perform all the operations atomically
        const batch = db.batch();
        // Process each cart item
        const orderDetails = cartItems.map(item => {
            const orderRef = db.collection('Orders').doc();
            batch.set(orderRef, {
                ProductName: item.ProductName,
                ProductId: item.id,
                Quantity: item.Quantity,
                TotalPrice: item.TotalPrice,
                Images: item.Images,
                selectedSize: item.selectedSize,
                deliveryFee: item.deliveryFee,
                orderId: orderRef.id,
                status: 'Pending',
                orderedAt: firebase_admin_1.default.firestore.FieldValue.serverTimestamp()
            });
            return {
                ProductName: item.ProductName,
                ProductId: item.id,
                Quantity: item.Quantity,
                TotalPrice: item.TotalPrice,
                selectedSize: item.selectedSize,
                deliveryFee: item.deliveryFee,
            };
        });
        // Commit the batch
        yield batch.commit();
        // Send confirmation email
        (0, mailer_1.sendOrderConfirmationEmail)(shippingInfo.email, orderDetails);
        // Send notification to admin
        const message = {
            notification: {
                title: 'New Order Received',
                body: `Order from ${shippingInfo.email} has been placed.`,
            },
            topic: 'admin-notifications', // Ensure the admin is subscribed to this topic
        };
        yield sendNotification(message);
        res.status(201).send('Checkout successful, orders placed.');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.checkout = checkout;
