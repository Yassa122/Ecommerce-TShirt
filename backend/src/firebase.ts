import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const serviceAccount = require('./service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: "e-commerce-t-shirt.appspot.com"
});

export const db = admin.firestore();
export const storage = admin.storage().bucket();
export const messaging = admin.messaging(); // Export messaging service
