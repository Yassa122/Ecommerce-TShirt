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
exports.getCartItems = exports.addToCart = exports.getProductById = exports.getProducts = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
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
