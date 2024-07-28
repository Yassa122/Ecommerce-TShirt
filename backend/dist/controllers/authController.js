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
exports.signin = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = firebase_admin_1.default.firestore();
// Generate a JWT token using the user's unique secret
const generateToken = (id, secret) => {
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: '1h' });
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    try {
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = yield userRef.get();
        if (!snapshot.empty) {
            return res.status(400).send('User already exists');
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Generate a unique secret for the user
        const userSecret = crypto_1.default.randomBytes(64).toString('hex');
        const newUser = {
            email,
            password: hashedPassword,
            secret: userSecret,
        };
        const userDocRef = yield db.collection('users').add(newUser);
        const token = generateToken(userDocRef.id, userSecret);
        yield userDocRef.update({ token });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(201).send({ token });
    }
    catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send(error.message);
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    try {
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = yield userRef.get();
        if (snapshot.empty) {
            return res.status(400).send('Invalid credentials');
        }
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        const isMatch = yield bcryptjs_1.default.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }
        const token = generateToken(userDoc.id, userData.secret);
        yield userDoc.ref.update({ token });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).send({ token });
    }
    catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).send(error.message);
    }
});
exports.signin = signin;
