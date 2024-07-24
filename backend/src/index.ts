import dotenv from 'dotenv';
import express from 'express';
import admin from 'firebase-admin';
import adminRoutes from './routes/adminRoutes';
import serviceAccount from './service-account-file.json'; // Corrected path
// import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
dotenv.config();
console.log('Environment variables loaded');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

console.log('Firebase Admin initialized');

// Access Firestore
const db = admin.firestore();
console.log('Firestore accessed');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

console.log('Registering routes');
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(Server is running on http://localhost:${port});
});