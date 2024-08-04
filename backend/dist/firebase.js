"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messaging = exports.storage = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
dotenv_1.default.config();
const serviceAccount = require('./service-account-file.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: "e-commerce-t-shirt.appspot.com"
});
exports.db = firebase_admin_1.default.firestore();
exports.storage = firebase_admin_1.default.storage().bucket();
exports.messaging = firebase_admin_1.default.messaging(); // Export messaging service
