import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import type { DiscordServer } from "@shared/schema";
import { SiDiscord } from "react-icons/si";
import { Moon, Sun, Loader2 } from "lucide-react";

import ServerSelector from "@/pages/server-selector";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import ConfigMain from "@/pages/config-main";
import ConfigChannels from "@/pages/config-channels";
import ConfigOther from "@/pages/config-other";
import ConfigPremium from "@/pages/config-premium";
import NotFound from "@/pages/not-found";

function LoginPage() {
  const { data: authUrl } = useQuery<{ url: string }>({
    queryKey: ["/api/auth/url"],
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="p-8 max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <SiDiscord className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Discord Bot Dashboard</h1>
          <p className="text-muted-foreground">
            Sign in with Discord to manage your bot configurations
          </p>
        </div>
        {authUrl ? (
          <Button asChild className="w-full" size="lg" data-testid="button-login">
            <a href={authUrl.url}>
              <SiDiscord className="mr-2 h-5 w-5" />
              Sign in with Discord
            </a>
          </Button>
        ) : (
          <Button disabled className="w-full" size="lg">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading...
          </Button>
        )}
      </Card>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

function AppRouter() {
  const { data: authStatus, isLoading: authLoading } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ["/api/auth/status"],
  });

  const [selectedServerId, setSelectedServerId] = useState<string | null>(
    () => localStorage.getItem("selectedServerId")
  );

  const { data: servers } = useQuery<DiscordServer[]>({
    queryKey: ["/api/discord/servers"],
    enabled: !!selectedServerId && authStatus?.isAuthenticated,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      console.error('Auth error:', params.get('error'));
    }
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" data-testid="loader-auth" />
      </div>
    );
  }

  if (!authStatus?.isAuthenticated) {
    return <LoginPage />;
  }

  const handleSelectServer = (serverId: string) => {
    setSelectedServerId(serverId);
    localStorage.setItem("selectedServerId", serverId);
  };

  const handleChangeServer = () => {
    setSelectedServerId(null);
    localStorage.removeItem("selectedServerId");
  };

  if (!selectedServerId) {
    return <ServerSelector onSelectServer={handleSelectServer} />;
  }

  const selectedServer = servers?.find(s => s.id === selectedServerId);

  const style = {
    "--sidebar-width": "15rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          serverName={selectedServer?.name}
          serverIcon={selectedServer?.icon}
          serverId={selectedServerId}
          onChangeServer={handleChangeServer}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-muted-foreground">Discord Bot Dashboard</h2>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8">
            <Switch>
              <Route path="/" component={() => <Dashboard serverId={selectedServerId} />} />
              <Route path="/dashboard" component={() => <Dashboard serverId={selectedServerId} />} />
              <Route path="/analytics" component={() => <Analytics serverId={selectedServerId} />} />
              <Route path="/config/main" component={() => <ConfigMain serverId={selectedServerId} />} />
              <Route path="/config/channels" component={() => <ConfigChannels serverId={selectedServerId} />} />
              <Route path="/config/other" component={() => <ConfigOther serverId={selectedServerId} />} />
              <Route path="/config/premium" component={() => <ConfigPremium serverId={selectedServerId} />} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <AppRouter />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
