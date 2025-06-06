import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { DataProvider } from "@/contexts/DataContext";
import { APP_CONFIG } from "@/config/app.config";
import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import IncomeManagement from "@/components/IncomeManagement";
import ExpenseManagement from "@/components/ExpenseManagement";
import ProgramManagement from "@/components/ProgramManagement";
import StudentManagement from "@/components/StudentManagement";
import ActivityManagement from "@/components/ActivityManagement";
import Reports from "@/components/Reports";
import Settings from "@/components/Settings";
import UpdateNotification from "@/components/UpdateNotification";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const MainApp = () => {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const getPageInfo = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return {
          title: APP_CONFIG.labels.dashboardTitle,
          subtitle: APP_CONFIG.labels.dashboardSubtitle,
        };
      case "income":
        return {
          title: APP_CONFIG.labels.incomeTitle,
          subtitle: APP_CONFIG.labels.incomeSubtitle,
        };
      case "expense":
        return {
          title: APP_CONFIG.labels.expensesTitle,
          subtitle: APP_CONFIG.labels.expensesSubtitle,
        };
      case "programs":
        return {
          title: APP_CONFIG.labels.programsTitle,
          subtitle: APP_CONFIG.labels.programsSubtitle,
        };
      case "students":
        return {
          title: APP_CONFIG.labels.studentsTitle,
          subtitle: APP_CONFIG.labels.studentsSubtitle,
        };
      case "activities":
        return {
          title: APP_CONFIG.labels.activitiesTitle,
          subtitle: APP_CONFIG.labels.activitiesSubtitle,
        };
      case "reports":
        return {
          title: APP_CONFIG.labels.reportsTitle,
          subtitle: APP_CONFIG.labels.reportsSubtitle,
        };
      case "settings":
        return {
          title: APP_CONFIG.labels.settingsTitle,
          subtitle: APP_CONFIG.labels.settingsSubtitle,
        };
      default:
        return {
          title: APP_CONFIG.labels.dashboardTitle,
          subtitle: APP_CONFIG.labels.dashboardSubtitle,
        };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "income":
        return <IncomeManagement />;
      case "expense":
        return <ExpenseManagement />;
      case "programs":
        return <ProgramManagement />;
      case "students":
        return <StudentManagement />;
      case "activities":
        return <ActivityManagement />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const pageInfo = getPageInfo(activeTab);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <UpdateNotification />

        {/* Content Area */}
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300"
          )}
        >
          <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
          <div className="space-y-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <MainApp />
        </DataProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
