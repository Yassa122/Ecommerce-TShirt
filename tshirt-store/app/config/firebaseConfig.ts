import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB7fjT3BJOxTA6dHSFH4PyrCtaMpK5OAWs",
  authDomain: "e-commerce-t-shirt.firebaseapp.com",
  projectId: "e-commerce-t-shirt",
  storageBucket: "e-commerce-t-shirt.appspot.com",
  messagingSenderId: "580207836879",
  appId: "1:580207836879:web:d52d32c83768a9b67741ba",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      // Send the token to the server and store it
      await fetch('https://your-server-url.com/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken }),
      });

      // Subscribe to the topic
      await fetch(`https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/admin-notifications`, {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'key=YOUR_SERVER_KEY'
        })
      });

      console.log('Subscribed to admin-notifications topic.');
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
};

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // Customize your notification here
  alert(payload.notification?.title);
});

export { messaging };
