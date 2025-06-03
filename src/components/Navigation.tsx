import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import OfflineIndicator from "./OfflineIndicator";
import {
  LayoutDashboard,
  Plus,
  Minus,
  FileText,
  LogOut,
  User,
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useApp();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "income", label: "Pemasukan", icon: Plus },
    { id: "expense", label: "Pengeluaran", icon: Minus },
    { id: "programs", label: "Program Kerja", icon: FileText },
    { id: "reports", label: "Laporan", icon: FileText },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-lg relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">KKN15</h1>
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              size="sm"
              className={`flex items-center space-x-2 whitespace-nowrap ${
                activeTab === item.id
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
