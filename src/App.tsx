import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Login from "@/components/Login";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import IncomeManagement from "@/components/IncomeManagement";
import ExpenseManagement from "@/components/ExpenseManagement";
import ProgramManagement from "@/components/ProgramManagement";
import Reports from "@/components/Reports";
import OfflineIndicator from "@/components/OfflineIndicator";
import UpdateNotification from "@/components/UpdateNotification";

const queryClient = new QueryClient();

const MainApp = () => {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!isAuthenticated) {
    return <Login />;
  }

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
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <OfflineIndicator />
      <UpdateNotification />
      <main className="p-4 md:p-6">{renderContent()}</main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <MainApp />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
