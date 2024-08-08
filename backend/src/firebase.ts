import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const serviceAccount = require('./e-commerce-t-shirt-firebase-adminsdk-ug3gf-d0aadc6e2b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: "e-commerce-t-shirt.appspot.com"
});

export const db = admin.firestore();
export const storage = admin.storage().bucket();
export const messaging = admin.messaging(); // Export messaging service
