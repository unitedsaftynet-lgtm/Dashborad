import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Image as ImageIcon } from "lucide-react";
import { mainConfigSchema, type MainConfig, type ServerConfig } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

interface ConfigMainProps {
  serverId: string;
}

export default function ConfigMain({ serverId }: ConfigMainProps) {
  const { toast } = useToast();
  const [additionalLinks, setAdditionalLinks] = useState<string[]>([]);

  const { data: config, isLoading } = useQuery<ServerConfig>({
    queryKey: ["/api/config", serverId],
  });

  const form = useForm<MainConfig>({
    resolver: zodResolver(mainConfigSchema),
    defaultValues: {
      adTitle: "",
      adDescription: "",
      adInviteLink: "",
      adOtherLinks: [],
      adBanner: "",
    },
  });

  useEffect(() => {
    if (config?.mainConfig) {
      form.reset({
        adTitle: config.mainConfig.adTitle || "",
        adDescription: config.mainConfig.adDescription || "",
        adInviteLink: config.mainConfig.adInviteLink || "",
        adOtherLinks: config.mainConfig.adOtherLinks || [],
        adBanner: config.mainConfig.adBanner || "",
      });
      setAdditionalLinks(config.mainConfig.adOtherLinks || []);
    }
  }, [config, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: MainConfig) => {
      return apiRequest("POST", `/api/config/main/${serverId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config", serverId] });
      toast({
        title: "Configuration saved",
        description: "Your main configuration has been updated successfully.",
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

  const onSubmit = (data: MainConfig) => {
    updateMutation.mutate(data);
  };

  const addLink = () => {
    const currentLinks = form.getValues("adOtherLinks") || [];
    if (currentLinks.length < 2) {
      form.setValue("adOtherLinks", [...currentLinks, ""]);
      setAdditionalLinks([...currentLinks, ""]);
    }
  };

  const removeLink = (index: number) => {
    const currentLinks = form.getValues("adOtherLinks") || [];
    const newLinks = currentLinks.filter((_, i) => i !== index);
    form.setValue("adOtherLinks", newLinks);
    setAdditionalLinks(newLinks);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-config" />
      </div>
    );
  }

  const description = form.watch("adDescription") || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Main Configuration</h1>
        <p className="text-muted-foreground">Set up your partnership advertisement</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Details</CardTitle>
              <CardDescription>
                Configure your partnership advertisement that will be sent to other servers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="adTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your advertisement title"
                        {...field}
                        data-testid="input-ad-title"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be the title of your embed advertisement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your server and what makes it special..."
                        className="min-h-32 resize-none"
                        {...field}
                        data-testid="input-ad-description"
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormDescription>
                        Detailed description of your server for partnerships
                      </FormDescription>
                      <span className={`text-xs ${description.length > 4000 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {description.length}/4000
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adInviteLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Invite Link</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://discord.gg/your-invite"
                        {...field}
                        data-testid="input-invite-link"
                      />
                    </FormControl>
                    <FormDescription>
                      Discord invite link for users to join your server
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <FormLabel>Additional Links</FormLabel>
                    <FormDescription className="mt-1">
                      Add up to 2 additional links (website, social media, etc.)
                    </FormDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLink}
                    disabled={(form.watch("adOtherLinks")?.length || 0) >= 2}
                    data-testid="button-add-link"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>

                {(form.watch("adOtherLinks") || []).map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`adOtherLinks.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="url"
                              placeholder={`Additional link ${index + 1}`}
                              {...field}
                              data-testid={`input-additional-link-${index}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeLink(index)}
                              data-testid={`button-remove-link-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="adBanner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/banner.png"
                        {...field}
                        data-testid="input-banner-url"
                      />
                    </FormControl>
                    <FormDescription>
                      URL to your banner image for the advertisement embed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("adBanner") && (
                <div className="space-y-2">
                  <FormLabel>Banner Preview</FormLabel>
                  <div className="border rounded-lg overflow-hidden bg-muted/50">
                    <img
                      src={form.watch("adBanner")}
                      alt="Banner preview"
                      className="w-full max-h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
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
