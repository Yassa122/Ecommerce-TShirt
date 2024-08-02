import React, { useEffect } from 'react';
import { messaging } from "../../config/firebaseConfig";

const SubscribeToNotifications: React.FC = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        await messaging.requestPermission();
        console.log('Notification permission granted.');
        const token = await messaging.getToken();
        console.log('FCM Token:', token);
        // Subscribe to topic
        await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/admin-notifications`, {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'key=YOUR_SERVER_KEY'
          })
        });
        console.log('Subscribed to admin-notifications topic.');
      } catch (err) {
        console.error('Unable to get permission to notify.', err);
      }
    };

    requestPermission();
  }, []);

  return null; // This component doesn't need to render anything
};

export default SubscribeToNotifications;
