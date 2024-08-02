importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB7fjT3BJOxTA6dHSFH4PyrCtaMpK5OAWs",
  authDomain: "e-commerce-t-shirt.firebaseapp.com",
  projectId: "e-commerce-t-shirt",
  storageBucket: "e-commerce-t-shirt.appspot.com",
  messagingSenderId: "580207836879",
  appId: "1:580207836879:web:d52d32c83768a9b67741ba",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
