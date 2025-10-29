import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import type { DiscordServer } from "@shared/schema";

interface ServerSelectorProps {
  onSelectServer: (serverId: string) => void;
}

export default function ServerSelector({ onSelectServer }: ServerSelectorProps) {
  const { data: servers, isLoading } = useQuery<DiscordServer[]>({
    queryKey: ["/api/discord/servers"],
  });

  const { data: user } = useQuery<{ username: string; avatar: string | null }>({
    queryKey: ["/api/discord/user"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" data-testid="loader-servers" />
          <p className="text-muted-foreground">Loading your servers...</p>
        </div>
      </div>
    );
  }

  if (!servers || servers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-8 max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <SiDiscord className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">No Servers Found</h2>
            <p className="text-muted-foreground">
              You don't have access to any Discord servers yet. Create or join a server to get started.
            </p>
          </div>
          <Button className="w-full" data-testid="button-refresh">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Open Discord
            </a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          {user && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user.avatar}`}
                    alt={user.username}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <SiDiscord className="h-6 w-6 text-primary" />
                )}
              </div>
              <span className="text-lg font-medium">{user.username}</span>
            </div>
          )}
          <h1 className="text-4xl font-bold">Select a Server</h1>
          <p className="text-lg text-muted-foreground">
            Choose a Discord server to manage your bot configuration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {servers.map((server) => (
            <Card
              key={server.id}
              className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
              onClick={() => onSelectServer(server.id)}
              data-testid={`card-server-${server.id}`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                  {server.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                      alt={server.name}
                      className="h-20 w-20 object-cover"
                    />
                  ) : (
                    <SiDiscord className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold line-clamp-2" data-testid={`text-servername-${server.id}`}>
                    {server.name}
                  </h3>
                  {server.owner && (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>Owner</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
