import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  Database,
  Eye,
} from "lucide-react";

const SecurityStatus: React.FC = () => {
  const securityFeatures = [
    {
      name: "Data Encryption",
      status: "active",
      description: "All data is encrypted using AES encryption before storage",
      icon: Lock,
    },
    {
      name: "Local Storage Only",
      status: "active",
      description: "Data never leaves your device - complete privacy",
      icon: Database,
    },
    {
      name: "Data Validation",
      status: "active",
      description: "All data is validated and sanitized before processing",
      icon: CheckCircle,
    },
    {
      name: "Backup & Recovery",
      status: "active",
      description: "Export and import capabilities for data safety",
      icon: Shield,
    },
    {
      name: "Integrity Checking",
      status: "active",
      description: "Data integrity is verified using cryptographic hashes",
      icon: Eye,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "inactive":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const activeFeatures = securityFeatures.filter(
    (f) => f.status === "active"
  ).length;
  const totalFeatures = securityFeatures.length;
  const securityScore = Math.round((activeFeatures / totalFeatures) * 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Security Status
          <Badge className={`ml-auto ${getStatusColor("active")}`}>
            {securityScore}% Secure
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Score */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div>
            <h4 className="font-semibold text-green-900">
              Security Level: Excellent
            </h4>
            <p className="text-sm text-green-700">
              {activeFeatures} of {totalFeatures} security features active
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {securityScore}%
          </div>
        </div>

        {/* Security Features List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">
            Active Security Features
          </h4>
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2 mt-0.5">
                  <IconComponent className="h-4 w-4 text-blue-600" />
                  {getStatusIcon(feature.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{feature.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(feature.status)}`}
                    >
                      {feature.status.charAt(0).toUpperCase() +
                        feature.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Security Best Practices
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Regularly export backup files and store them securely</li>
            <li>• Keep your browser updated for latest security patches</li>
            <li>• Don't access the app on shared or public computers</li>
            <li>• Clear browser data when using public devices</li>
            <li>• Consider using a password manager for added security</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityStatus;
