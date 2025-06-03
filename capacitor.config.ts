// Capacitor configuration for mobile app development
// Install @capacitor/cli if you plan to build mobile apps

interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    cleartext?: boolean;
  };
  plugins?: {
    SplashScreen?: {
      launchShowDuration?: number;
      backgroundColor?: string;
      androidScaleType?: string;
      showSpinner?: boolean;
    };
  };
}

const config: CapacitorConfig = {
  appId: "com.kkn.budget.nexus",
  appName: "KKN Budget Nexus",
  webDir: "dist",
  server: {
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3B82F6",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
