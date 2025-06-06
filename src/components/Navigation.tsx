import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import OfflineIndicator from "./OfflineIndicator";
import { APP_CONFIG } from "@/config/app.config";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Target,
  FileText,
  Database,
  Settings,
  LogOut,
  User,
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useApp();

  // Icon mapping for menu items
  const iconMap = {
    LayoutGrid: LayoutDashboard,
    Users: Users,
    Calendar: Calendar,
    MapPin: MapPin,
    MessageCircle: MessageCircle,
    TrendingDown: TrendingDown,
    TrendingUp: TrendingUp,
    Target: Target,
    FileText: FileText,
    Database: Database,
    Settings: Settings,
  };

  // Filter menu items based on feature flags
  const visibleMenuItems = APP_CONFIG.navigation.menuItems.filter((item) => {
    const featureMap = {
      students: APP_CONFIG.features.showStudentManagement,
      activities: APP_CONFIG.features.showActivityManagement,
      locations: APP_CONFIG.features.showLocationManagement,
      communication: APP_CONFIG.features.showCommunicationHub,
      expenses: APP_CONFIG.features.showExpenseManagement,
      income: APP_CONFIG.features.showIncomeManagement,
      programs: APP_CONFIG.features.showProgramManagement,
      reports: APP_CONFIG.features.showReports,
      backup: APP_CONFIG.features.showDataBackup,
    };

    return featureMap[item.key] !== false;
  });

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-lg relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{APP_CONFIG.appShortName}</h1>
        <div className="flex items-center space-x-2">
          <OfflineIndicator />
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
            <span className="px-2 py-1 bg-blue-900 rounded-full text-xs">
              {user?.role === "treasurer" ? "Bendahara" : "Anggota"}
            </span>
          </div>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto">
        {visibleMenuItems.map((item) => {
          const Icon =
            iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
          return (
            <Button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              variant={activeTab === item.key ? "secondary" : "ghost"}
              size="sm"
              className={`flex items-center space-x-2 whitespace-nowrap ${
                activeTab === item.key
                  ? "bg-white text-blue-700"
                  : "text-white hover:bg-blue-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
