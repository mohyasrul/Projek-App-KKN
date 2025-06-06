import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OfflineIndicator from "./OfflineIndicator";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_CONFIG } from "@/config/app.config";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <Card className="mb-6 bg-white/50 backdrop-blur-sm border-gray-200/50 shadow-sm">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center space-x-3">
            <OfflineIndicator />

            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
          </div>
        </div>

        {/* Quick Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />{" "}
            <Input
              placeholder={APP_CONFIG.labels.searchPlaceholder}
              className="pl-10 bg-white/70"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{APP_CONFIG.labels.systemVersion}:</span>
            <Badge variant="outline" className="font-semibold">
              {APP_CONFIG.appVersion}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Header;
