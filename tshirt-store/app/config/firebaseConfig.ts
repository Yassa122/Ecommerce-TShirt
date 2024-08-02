// firebaseConfig.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB7fjT3BJOxTA6dHSFH4PyrCtaMpK5OAWs",
  authDomain: "e-commerce-t-shirt.firebaseapp.com",
  projectId: "e-commerce-t-shirt",
  storageBucket: "e-commerce-t-shirt.appspot.com",
  messagingSenderId: "580207836879",
  appId: "1:580207836879:web:d52d32c83768a9b67741ba",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { app, getToken, messaging, onMessage };

