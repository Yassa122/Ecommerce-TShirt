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
exports.authMiddleware = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = firebase_admin_1.default.firestore();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied. No Token Provided.');
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.id) {
            throw new Error('Invalid token');
        }
        const userRef = db.collection('users').doc(decoded.id);
        const userDoc = yield userRef.get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        const userData = userDoc.data();
        if (!userData) {
            throw new Error('User data not found');
        }
        jsonwebtoken_1.default.verify(token, userData.secret);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid Token.');
    }
});
exports.authMiddleware = authMiddleware;
