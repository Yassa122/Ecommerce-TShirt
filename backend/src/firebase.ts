import admin from 'firebase-admin';
import serviceAccount from './service-account-file.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export const db = admin.firestore();
export { admin };
console.log('Firebase Admin initialized and Firestore accessed successfully');
