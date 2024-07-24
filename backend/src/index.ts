import dotenv from 'dotenv';
import express from 'express';
import './firebase'; // Ensure Firebase is initialized before anything else
import { db } from './firebase';
import userRoutes from './routes/userRoutes';

dotenv.config();
console.log('Environment variables loaded');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

console.log('Registering routes');
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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
