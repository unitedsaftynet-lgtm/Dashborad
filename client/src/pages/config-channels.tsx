import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Hash } from "lucide-react";
import { channelConfigSchema, type ChannelConfig, type ServerConfig, type DiscordChannel } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect } from "react";

interface ConfigChannelsProps {
  serverId: string;
}

export default function ConfigChannels({ serverId }: ConfigChannelsProps) {
  const { toast } = useToast();

  const { data: config, isLoading: configLoading } = useQuery<ServerConfig>({
    queryKey: ["/api/config", serverId],
  });

  const { data: channels, isLoading: channelsLoading } = useQuery<DiscordChannel[]>({
    queryKey: ["/api/discord/channels", serverId],
  });

  const form = useForm<ChannelConfig>({
    resolver: zodResolver(channelConfigSchema),
    defaultValues: {
      partnerChannel: null,
      reviewChannel: null,
      bumpChannel: null,
      logChannel: null,
    },
  });

  useEffect(() => {
    if (config?.channelConfig) {
      form.reset({
        partnerChannel: config.channelConfig.partnerChannel || null,
        reviewChannel: config.channelConfig.reviewChannel || null,
        bumpChannel: config.channelConfig.bumpChannel || null,
        logChannel: config.channelConfig.logChannel || null,
      });
    }
  }, [config, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: ChannelConfig) => {
      return apiRequest("POST", `/api/config/channels/${serverId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config", serverId] });
      toast({
        title: "Configuration saved",
        description: "Your channel configuration has been updated successfully.",
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

  const onSubmit = (data: ChannelConfig) => {
    updateMutation.mutate(data);
  };

  const isLoading = configLoading || channelsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-config" />
      </div>
    );
  }

  const textChannels = channels?.filter(c => c.type === 0) || [];

  const channelFields = [
    {
      name: "partnerChannel" as const,
      label: "Partner Channel",
      description: "Channel where partnership advertisements will be posted",
      icon: Hash,
    },
    {
      name: "reviewChannel" as const,
      label: "Review Channel",
      description: "Channel for reviewing partnership requests",
      icon: Hash,
    },
    {
      name: "bumpChannel" as const,
      label: "Bump Channel",
      description: "Channel for bump notifications and reminders",
      icon: Hash,
    },
    {
      name: "logChannel" as const,
      label: "Log Channel",
      description: "Channel for bot activity logs and events",
      icon: Hash,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Channel Configuration</h1>
        <p className="text-muted-foreground">Configure channels for bot operations</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Settings</CardTitle>
              <CardDescription>
                Select the channels where the bot will perform different operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {channelFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ fieldState, ...renderField }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <field.icon className="h-4 w-4" />
                        {field.label}
                      </FormLabel>
                      <Select
                        onValueChange={renderField.field.onChange}
                        value={renderField.field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger data-testid={`select-${field.name}`}>
                            <SelectValue placeholder="Select a channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None (Disabled)</SelectItem>
                          {textChannels.map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3" />
                                {channel.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>{field.description}</FormDescription>
                      <FormMessage />
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
