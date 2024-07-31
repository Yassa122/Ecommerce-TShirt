import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import './firebase'; // Ensure Firebase is initialized before anything else
import { db } from './firebase';
import adminRoutes from './routes/adminRoutes'; // Import admin routes
import authRoutes from './routes/authRoutes'; // Import auth routes
import userRoutes from './routes/userRoutes'; // Import user routes

dotenv.config();
console.log('Environment variables loaded');

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

const port = process.env.PORT || 3000;

// Get CORS origin from environment variable
const corsOrigin = "amaria-local.vercel.app";

console.log('Registering routes');
app.use(cors({
  origin: corsOrigin, // Use the CORS origin from environment variables
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization', // Allow only these headers
}));

app.use('/api/users', userRoutes); // Register user routes
app.use('/api/auth', authRoutes); // Register authentication routes
app.use('/api/admin', adminRoutes); // Register admin routes

// Test Firestore connection
app.get('/testFirestore', async (req, res) => {
  try {
    console.log('Accessing Firestore...');
    const testDoc = db.collection('testCollection').doc('testDoc');
    await testDoc.set({ testField: 'testValue' });
    console.log('Document written to Firestore');
    const doc = await testDoc.get();
    console.log('Document read from Firestore:', doc.data());
    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Error accessing Firestore:', error);
    res.status(500).send((error as Error).message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
