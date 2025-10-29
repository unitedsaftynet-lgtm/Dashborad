import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Send, Inbox, Award, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsData } from "@shared/schema";

interface DashboardProps {
  serverId: string;
}

export default function Dashboard({ serverId }: DashboardProps) {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics", serverId],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your bot control center</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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

  const stats = [
    {
      title: "Growth",
      value: analytics?.growth || 0,
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Sent Requests",
      value: analytics?.sentRequests || 0,
      icon: Send,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Received Requests",
      value: analytics?.receivedRequests || 0,
      icon: Inbox,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Reputation Score",
      value: analytics?.reputationScore || 0,
      icon: Award,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  const additionalStats = [
    {
      title: "Total Partnerships",
      value: analytics?.totalPartnerships || 0,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Pending Requests",
      value: analytics?.pendingRequests || 0,
      icon: Clock,
      color: "text-chart-4",
    },
    {
      title: "Approved",
      value: analytics?.approvedRequests || 0,
      icon: CheckCircle,
      color: "text-chart-3",
    },
    {
      title: "Rejected",
      value: analytics?.rejectedRequests || 0,
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your bot control center</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {additionalStats.map((stat) => (
              <div key={stat.title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="font-medium">{stat.title}</span>
                </div>
                <span className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/ /g, "-")}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Configure your bot settings to optimize partnerships and manage your server effectively.
            </p>
            <div className="pt-2 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Next Steps:</span>
                <ul className="mt-2 space-y-1 text-muted-foreground ml-4 list-disc">
                  <li>Set up your advertisement in Main Config</li>
                  <li>Configure channels for partnerships</li>
                  <li>Enable premium features for automation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
