import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Send, Inbox, Award, Users, Clock, CheckCircle, XCircle, Server as ServerIcon, Shield, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsData, ServerInfo } from "@shared/schema";

interface AnalyticsProps {
  serverId: string;
}

export default function Analytics({ serverId }: AnalyticsProps) {
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics", serverId],
  });

  const { data: serverInfo, isLoading: serverLoading } = useQuery<ServerInfo>({
    queryKey: ["/api/discord/server-info", serverId],
  });

  const isLoading = analyticsLoading || serverLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your bot's performance</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const primaryStats = [
    {
      title: "Growth",
      value: analytics?.growth || 0,
      icon: TrendingUp,
      description: "Members gained",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Sent Requests",
      value: analytics?.sentRequests || 0,
      icon: Send,
      description: "Partnership requests sent",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Received Requests",
      value: analytics?.receivedRequests || 0,
      icon: Inbox,
      description: "Partnership requests received",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Reputation Score",
      value: analytics?.reputationScore || 0,
      icon: Award,
      description: "Out of 100",
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  const secondaryStats = [
    {
      title: "Total Partnerships",
      value: analytics?.totalPartnerships || 0,
      icon: Users,
      description: "Active partnerships",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Requests",
      value: analytics?.pendingRequests || 0,
      icon: Clock,
      description: "Awaiting response",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Approved",
      value: analytics?.approvedRequests || 0,
      icon: CheckCircle,
      description: "Successful partnerships",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Rejected",
      value: analytics?.rejectedRequests || 0,
      icon: XCircle,
      description: "Declined requests",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  const verificationLevels = ["None", "Low", "Medium", "High", "Very High"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Analytics</h1>
        <p className="text-muted-foreground">Track your bot's performance and server statistics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {primaryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/ /g, "-")}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {secondaryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/ /g, "-")}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {serverInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="h-5 w-5" />
              Server Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {serverInfo.icon ? (
                      <img
                        src={`https://cdn.discordapp.com/icons/${serverInfo.id}/${serverInfo.icon}.png`}
                        alt={serverInfo.name}
                        className="h-16 w-16 object-cover"
                      />
                    ) : (
                      <ServerIcon className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" data-testid="text-server-name">{serverInfo.name}</h3>
                    {serverInfo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{serverInfo.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Member Count</span>
                    </div>
                    <span className="font-semibold" data-testid="stat-member-count">{serverInfo.memberCount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Boost Level</span>
                    </div>
                    <span className="font-semibold" data-testid="stat-boost-level">Level {serverInfo.boostLevel}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Verification Level</span>
                    </div>
                    <span className="font-semibold" data-testid="stat-verification-level">
                      {verificationLevels[serverInfo.verificationLevel]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created</span>
                    </div>
                    <span className="font-semibold" data-testid="stat-created-date">
                      {new Date(serverInfo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Performance Summary</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Partnership Success Rate</span>
                      <span className="font-medium">
                        {analytics && analytics.approvedRequests + analytics.rejectedRequests > 0
                          ? Math.round((analytics.approvedRequests / (analytics.approvedRequests + analytics.rejectedRequests)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-chart-3"
                        style={{
                          width: `${analytics && analytics.approvedRequests + analytics.rejectedRequests > 0
                            ? (analytics.approvedRequests / (analytics.approvedRequests + analytics.rejectedRequests)) * 100
                            : 0}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Reputation Score</span>
                      <span className="font-medium">{analytics?.reputationScore || 0}/100</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-chart-5"
                        style={{ width: `${analytics?.reputationScore || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
