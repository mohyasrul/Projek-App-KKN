import React, { useState, useEffect } from "react";

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineIndicator, setShowOnlineIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineIndicator(true);
      // Hide online indicator after 3 seconds
      setTimeout(() => setShowOnlineIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineIndicator(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Only show when offline or briefly when coming back online
  if (!isOnline || showOnlineIndicator) {
    return (
      <div
        className={`fixed top-4 right-16 z-50 w-3 h-3 rounded-full transition-all duration-300 ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
        title={isOnline ? "Online" : "Offline"}
      />
    );
  }

  return null;
};

export default OfflineIndicator;
