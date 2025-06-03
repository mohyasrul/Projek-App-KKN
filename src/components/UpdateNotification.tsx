import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, X } from "lucide-react";

const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    setShowUpdate(true);
                  }
                });
              }
            });

            // Check for updates immediately
            registration.update();
          }
        } catch (error) {
          console.error("Error checking for updates:", error);
        }
      };

      // Check for updates on load and every 5 minutes
      checkForUpdates();
      const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      // Tell service worker to skip waiting and take control
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: "skipWaiting",
        });
      }

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error updating app:", error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <Card className="shadow-lg border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">
                Update Available
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                A new version of the app is ready to install.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Update Now
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                >
                  Later
                </Button>
              </div>
            </div>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              disabled={isUpdating}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateNotification;
