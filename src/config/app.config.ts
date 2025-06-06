// App Configuration - Customize this file for rebranding
export const APP_CONFIG = {
  // Application Identity
  appName: "Management System",
  appShortName: "MS",
  appDescription: "Sistem Manajemen Terintegrasi",
  appVersion: "1.0.0",

  // Branding & Theme
  branding: {
    primaryColor: "from-blue-900 via-blue-700 to-blue-500",
    accentColor: "text-blue-700",
    accentHover: "hover:bg-blue-50",
    logoText: "MS",
    showLogo: true,
  },

  // Navigation & Menu
  navigation: {
    sidebarTitle: "Management Menu",
    menuItems: [
      { key: "dashboard", label: "Dashboard", icon: "LayoutGrid" },
      { key: "students", label: "User Management", icon: "Users" },
      { key: "activities", label: "Activity Management", icon: "Calendar" },
      { key: "locations", label: "Location Management", icon: "MapPin" },
      {
        key: "communication",
        label: "Communication Hub",
        icon: "MessageCircle",
      },
      { key: "expenses", label: "Expense Management", icon: "TrendingDown" },
      { key: "income", label: "Income Management", icon: "TrendingUp" },
      { key: "programs", label: "Program Management", icon: "Target" },
      { key: "reports", label: "Reports", icon: "FileText" },
      { key: "backup", label: "Data Backup", icon: "Database" },
      { key: "settings", label: "Settings", icon: "Settings" },
    ],
  },

  // Feature Configuration
  features: {
    showStudentManagement: true,
    showActivityManagement: true,
    showLocationManagement: false,
    showCommunicationHub: false,
    showExpenseManagement: true,
    showIncomeManagement: true,
    showProgramManagement: true,
    showReports: true,
    showDataBackup: true,
    showSecurityStatus: true,
  }, // Text & Labels
  labels: {
    loginTitle: "Sign In",
    loginSubtitle: "Access your account",
    loginSuccess: "Login Successful",
    loginFailed: "Login Failed",
    loginError: "Invalid username or password",
    welcome: "Welcome to",
    signingIn: "Signing In...",
    signIn: "Sign In",
    username: "Username",
    password: "Password",
    searchPlaceholder: "Search for transactions, programs, or participants...",
    systemVersion: "System Version",
    notifications: "Notifications",
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Overview of activities and finances",
    studentsTitle: "User Management",
    studentsSubtitle: "Manage users and groups",
    activitiesTitle: "Activity Management",
    activitiesSubtitle: "Manage schedules and daily activities",
    locationsTitle: "Location Management",
    locationsSubtitle: "Manage locations and activity venues",
    communicationTitle: "Communication Hub",
    communicationSubtitle: "Messages and announcements",
    expensesTitle: "Expense Management",
    expensesSubtitle: "Manage outgoing funds",
    incomeTitle: "Income Management",
    incomeSubtitle: "Manage incoming funds",
    programsTitle: "Program Management",
    programsSubtitle: "Manage programs and activities",
    reportsTitle: "Reports",
    reportsSubtitle: "Financial and activity reports",
    backupTitle: "Data Backup",
    backupSubtitle: "Backup and restore data",
    settingsTitle: "Settings",
    settingsSubtitle: "Application configuration",
  },

  // Footer & Credits
  footer: {
    show: true,
    text: "Powered by Modern Technology",
    version: true,
    credits: "Built with React & TypeScript",
  },

  // Default Values
  defaults: {
    currency: "IDR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "id",
    pagination: 10,
  },

  // Contact & Support
  support: {
    email: "support@example.com",
    phone: "+62 xxx xxxx xxxx",
    website: "https://example.com",
  },
};

// Environment-specific configurations
export const ENVIRONMENT = {
  development: {
    apiUrl: "http://localhost:3000/api",
    debug: true,
    showDevTools: true,
  },
  production: {
    apiUrl: "https://api.example.com",
    debug: false,
    showDevTools: false,
  },
};

// Get current environment config
export const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || "development";
  return (
    ENVIRONMENT[env as keyof typeof ENVIRONMENT] || ENVIRONMENT.development
  );
};
