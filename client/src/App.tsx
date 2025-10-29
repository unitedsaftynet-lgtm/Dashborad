import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DiscordServer } from "@shared/schema";

import ServerSelector from "@/pages/server-selector";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import ConfigMain from "@/pages/config-main";
import ConfigChannels from "@/pages/config-channels";
import ConfigOther from "@/pages/config-other";
import ConfigPremium from "@/pages/config-premium";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const [selectedServerId, setSelectedServerId] = useState<string | null>(
    () => localStorage.getItem("selectedServerId")
  );

  const { data: servers } = useQuery<DiscordServer[]>({
    queryKey: ["/api/discord/servers"],
    enabled: !!selectedServerId,
  });

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
            <h2 className="text-sm font-medium text-muted-foreground">Discord Bot Dashboard</h2>
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
      <TooltipProvider>
        <AppRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
