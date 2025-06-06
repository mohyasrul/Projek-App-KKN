import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import {
  LayoutDashboard,
  Plus,
  Minus,
  FileText,
  Users,
  Calendar,
  MapPin,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user, logout } = useApp();
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "income", label: "Pemasukan", icon: Plus },
    { id: "expense", label: "Pengeluaran", icon: Minus },
    { id: "programs", label: "Program Kerja", icon: FileText },
    { id: "students", label: "Peserta KKN", icon: Users },
    { id: "activities", label: "Kegiatan", icon: Calendar },
    { id: "reports", label: "Laporan", icon: FileText },
  ];

  const bottomMenuItems = [
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 shadow-xl",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              KKN App
            </h1>
          )}
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700 p-2"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="mt-3 flex items-center space-x-2 text-sm">
            <div className="p-2 bg-blue-800 rounded-full">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-blue-200 text-xs">
                {user?.role === "treasurer" ? "Bendahara" : "Anggota"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal transition-all duration-200",
                  isActive
                    ? "bg-blue-700 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-700/50 hover:text-white",
                  isCollapsed ? "px-2" : "px-3"
                )}
              >
                <Icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="border-t border-blue-700 p-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal mb-1",
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-700/50 hover:text-white",
                isCollapsed ? "px-2" : "px-3"
              )}
            >
              <Icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Button>
          );
        })}

        <Button
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal text-red-200 hover:bg-red-600/20 hover:text-red-100",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          <LogOut className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && <span>Keluar</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
