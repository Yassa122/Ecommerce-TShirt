import React, { useEffect } from 'react';
import { requestNotificationPermission } from "../../config/firebaseConfig";

const SubscribeToNotifications: React.FC = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return null; // This component doesn't need to render anything
};

export default SubscribeToNotifications;
