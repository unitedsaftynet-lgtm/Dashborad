import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Crown, Palette, CheckCircle, TrendingUp, Users, Zap } from "lucide-react";
import { premiumConfigSchema, type PremiumConfig, type ServerConfig } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect } from "react";

interface ConfigPremiumProps {
  serverId: string;
}

export default function ConfigPremium({ serverId }: ConfigPremiumProps) {
  const { toast } = useToast();

  const { data: config, isLoading } = useQuery<ServerConfig>({
    queryKey: ["/api/config", serverId],
  });

  const form = useForm<PremiumConfig>({
    resolver: zodResolver(premiumConfigSchema),
    defaultValues: {
      embedColor: "#5865F2",
      autoApprove: false,
      autoBump: false,
      autoMass: false,
      autoBurst: false,
    },
  });

  useEffect(() => {
    if (config?.premiumConfig) {
      form.reset({
        embedColor: config.premiumConfig.embedColor || "#5865F2",
        autoApprove: config.premiumConfig.autoApprove || false,
        autoBump: config.premiumConfig.autoBump || false,
        autoMass: config.premiumConfig.autoMass || false,
        autoBurst: config.premiumConfig.autoBurst || false,
      });
    }
  }, [config, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: PremiumConfig) => {
      return apiRequest("POST", `/api/config/premium/${serverId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config", serverId] });
      toast({
        title: "Configuration saved",
        description: "Your premium configuration has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PremiumConfig) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-config" />
      </div>
    );
  }

  const toggleFeatures = [
    {
      name: "autoApprove" as const,
      label: "Auto Approve",
      description: "Automatically approve partnership requests from trusted servers",
      icon: CheckCircle,
    },
    {
      name: "autoBump" as const,
      label: "Auto Bump",
      description: "Automatically bump your server in partner channels",
      icon: TrendingUp,
    },
    {
      name: "autoMass" as const,
      label: "Auto Mass",
      description: "Send mass partnership requests to multiple servers",
      icon: Users,
    },
    {
      name: "autoBurst" as const,
      label: "Auto Burst",
      description: "Burst mode for rapid partnership request sending",
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-chart-5/10 flex items-center justify-center">
          <Crown className="h-6 w-6 text-chart-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Premium Configuration</h1>
          <p className="text-muted-foreground">Advanced features for premium users</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look of your bot embeds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="embedColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Embed Color</FormLabel>
                    <div className="flex gap-4 items-center">
                      <FormControl>
                        <div className="flex gap-3 items-center">
                          <div
                            className="h-12 w-12 rounded-lg border-2 border-border flex-shrink-0"
                            style={{ backgroundColor: field.value }}
                          />
                          <Input
                            type="color"
                            {...field}
                            className="h-12 w-24 cursor-pointer"
                            data-testid="input-embed-color"
                          />
                          <Input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#5865F2"
                            className="w-32 font-mono"
                            data-testid="input-color-hex"
                          />
                        </div>
                      </FormControl>
                    </div>
                    <FormDescription>
                      Color for Discord embed borders in partnership messages
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automation Features</CardTitle>
              <CardDescription>
                Enable advanced automation features for your bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {toggleFeatures.map((feature, index) => (
                <FormField
                  key={feature.name}
                  control={form.control}
                  name={feature.name}
                  render={({ field }) => (
                    <FormItem className={`flex items-center justify-between p-4 ${index !== toggleFeatures.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <FormLabel className="text-base font-medium cursor-pointer">
                            {feature.label}
                          </FormLabel>
                          <FormDescription className="text-sm">
                            {feature.description}
                          </FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid={`toggle-${feature.name}`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              data-testid="button-reset"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              data-testid="button-save"
            >
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Configuration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
