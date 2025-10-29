import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, BarChart3, Settings, Sliders, Crown, Hash, LogOut, Server } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
];

const configItems = [
  {
    title: "Main Config",
    url: "/config/main",
    icon: Settings,
  },
  {
    title: "Channel Config",
    url: "/config/channels",
    icon: Hash,
  },
  {
    title: "Other Configs",
    url: "/config/other",
    icon: Sliders,
  },
  {
    title: "Premium Config",
    url: "/config/premium",
    icon: Crown,
  },
];

interface AppSidebarProps {
  serverName?: string;
  serverIcon?: string | null;
  serverId?: string;
  onChangeServer: () => void;
}

export function AppSidebar({ serverName, serverIcon, serverId, onChangeServer }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {serverIcon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${serverId}/${serverIcon}.png`}
                alt={serverName || "Server"}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <SiDiscord className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate text-sm" data-testid="text-servername">
              {serverName || "Discord Server"}
            </h2>
            <p className="text-xs text-muted-foreground">Bot Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/ /g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onChangeServer}
          data-testid="button-change-server"
        >
          <Server className="h-4 w-4" />
          <span>Change Server</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
