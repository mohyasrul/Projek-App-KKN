import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enhanced service worker registration for better update handling
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none", // Always check for updates
      });

      console.log("Service Worker registered successfully:", registration);

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.action === "skipWaiting") {
          // Service worker will skip waiting and take control
        }
      });

      // Check for updates immediately and periodically
      const checkForUpdates = () => {
        registration.update();
      };

      // Check for updates every 5 minutes
      setInterval(checkForUpdates, 5 * 60 * 1000);

      // Check for updates when page becomes visible
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          checkForUpdates();
        }
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
