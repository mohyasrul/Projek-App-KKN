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
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 ${
          isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
        title={isOnline ? "Back Online" : "You're Offline"}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="font-medium">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    );
  }

  return null;
};

export default OfflineIndicator;
