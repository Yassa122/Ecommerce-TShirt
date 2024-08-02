import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const serviceAccount = require('./service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: "gs://e-commerce-t-shirt.appspot.com" // Add your bucket name here
});

export const db = admin.firestore();
export const storage = admin.storage().bucket(); // Access the storage bucket
