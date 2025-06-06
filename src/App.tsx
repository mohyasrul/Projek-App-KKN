import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import IncomeManagement from "@/components/IncomeManagement";
import ExpenseManagement from "@/components/ExpenseManagement";
import ProgramManagement from "@/components/ProgramManagement";
import StudentManagement from "@/components/StudentManagement";
import ActivityManagement from "@/components/ActivityManagement";
import LocationManagement from "@/components/LocationManagement";
import CommunicationHub from "@/components/CommunicationHub";
import Reports from "@/components/Reports";
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
          title: "Dashboard",
          subtitle: "Ringkasan kegiatan dan keuangan KKN",
        };
      case "income":
        return {
          title: "Pemasukan",
          subtitle: "Kelola dana masuk program KKN",
        };
      case "expense":
        return {
          title: "Pengeluaran",
          subtitle: "Kelola dana keluar program KKN",
        };
      case "programs":
        return {
          title: "Program Kerja",
          subtitle: "Kelola program dan kegiatan KKN",
        };
      case "students":
        return {
          title: "Peserta KKN",
          subtitle: "Kelola data peserta dan kelompok",
        };
      case "activities":
        return {
          title: "Kegiatan",
          subtitle: "Kelola jadwal dan aktivitas harian",
        };
      case "locations":
        return {
          title: "Lokasi",
          subtitle: "Kelola lokasi dan tempat kegiatan",
        };
      case "communication":
        return { title: "Komunikasi", subtitle: "Pesan dan pengumuman" };
      case "reports":
        return { title: "Laporan", subtitle: "Laporan keuangan dan kegiatan" };
      case "settings":
        return { title: "Pengaturan", subtitle: "Konfigurasi aplikasi" };
      default:
        return {
          title: "Dashboard",
          subtitle: "Ringkasan kegiatan dan keuangan KKN",
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
      case "locations":
        return <LocationManagement />;
      case "communication":
        return <CommunicationHub />;
      case "reports":
        return <Reports />;
      case "settings":
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Fitur Pengaturan akan segera hadir</p>
          </div>
        );
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
        <Toaster />
        <Sonner />
        <MainApp />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
