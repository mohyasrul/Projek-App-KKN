import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Building2 } from "lucide-react";
import { APP_CONFIG } from "@/config/app.config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      const success = login(username, password);

      if (success) {
        toast({
          title: APP_CONFIG.labels.loginSuccess,
          description: `${APP_CONFIG.labels.welcome} ${APP_CONFIG.appName}`,
        });
      } else {
        toast({
          title: APP_CONFIG.labels.loginFailed,
          description: APP_CONFIG.labels.loginError,
          variant: "destructive",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${APP_CONFIG.branding.primaryColor} flex items-center justify-center p-4`}
    >
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center text-white">
            {APP_CONFIG.branding.showLogo && (
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            <CardTitle className="text-3xl font-bold mb-2">
              {APP_CONFIG.appName}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {APP_CONFIG.appDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-blue-200" />
                  <Input
                    type="text"
                    placeholder={APP_CONFIG.labels.username}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-200" />
                  <Input
                    type="password"
                    placeholder={APP_CONFIG.labels.password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className={`w-full bg-white ${APP_CONFIG.branding.accentColor} ${APP_CONFIG.branding.accentHover} font-semibold`}
                disabled={isLoading}
              >
                {isLoading
                  ? APP_CONFIG.labels.signingIn
                  : APP_CONFIG.labels.signIn}
              </Button>
            </form>

            {APP_CONFIG.footer.show && (
              <div className="mt-6 text-sm text-blue-100 text-center">
                <p>{APP_CONFIG.footer.text}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
