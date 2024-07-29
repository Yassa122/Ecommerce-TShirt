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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
require("./firebase"); // Ensure Firebase is initialized before anything else
const firebase_1 = require("./firebase");
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes")); // Import admin routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Import auth routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Import user routes
dotenv_1.default.config();
console.log('Environment variables loaded');
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Parse JSON bodies
app.use((0, cookie_parser_1.default)()); // Parse cookies
const port = process.env.PORT || 3000;
console.log('Registering routes');
app.use((0, cors_1.default)({
    origin: 'amaria-backend.vercel.app',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization', // Allow only these headers
}));
app.use('/api/users', userRoutes_1.default); // Register user routes
app.use('/api/auth', authRoutes_1.default); // Register authentication routes
app.use('/api/admin', adminRoutes_1.default); // Register admin routes
// Test Firestore connection
app.get('/testFirestore', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Accessing Firestore...');
        const testDoc = firebase_1.db.collection('testCollection').doc('testDoc');
        yield testDoc.set({ testField: 'testValue' });
        console.log('Document written to Firestore');
        const doc = yield testDoc.get();
        console.log('Document read from Firestore:', doc.data());
        res.status(200).json(doc.data());
    }
    catch (error) {
        console.error('Error accessing Firestore:', error);
        res.status(500).send(error.message);
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
