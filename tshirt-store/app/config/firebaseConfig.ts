// firebaseConfig.ts
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB7fjT3BJOxTA6dHSFH4PyrCtaMpK5OAWs",
  authDomain: "e-commerce-t-shirt.firebaseapp.com",
  projectId: "e-commerce-t-shirt",
  storageBucket: "e-commerce-t-shirt.appspot.com",
  messagingSenderId: "580207836879",
  appId: "1:580207836879:web:d52d32c83768a9b67741ba",
};

let messaging: Messaging | undefined;
if (typeof window !== "undefined" && !getApps().length) {
  const app: FirebaseApp = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export { getToken, messaging, onMessage };

