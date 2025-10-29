import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gamepad2, Code, Music, GraduationCap, Users, Film, Palette, Briefcase, Heart, MoreHorizontal } from "lucide-react";
import { otherConfigSchema, type OtherConfig, type ServerConfig, CATEGORIES } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect } from "react";

interface ConfigOtherProps {
  serverId: string;
}

const categoryIcons = {
  Gaming: Gamepad2,
  Technology: Code,
  Music: Music,
  Education: GraduationCap,
  Community: Users,
  Entertainment: Film,
  "Art & Design": Palette,
  Business: Briefcase,
  Lifestyle: Heart,
  Other: MoreHorizontal,
};

export default function ConfigOther({ serverId }: ConfigOtherProps) {
  const { toast } = useToast();

  const { data: config, isLoading } = useQuery<ServerConfig>({
    queryKey: ["/api/config", serverId],
  });

  const form = useForm<OtherConfig>({
    resolver: zodResolver(otherConfigSchema),
    defaultValues: {
      category: "",
    },
  });

  useEffect(() => {
    if (config?.otherConfig) {
      form.reset({
        category: config.otherConfig.category || "",
      });
    }
  }, [config, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: OtherConfig) => {
      return apiRequest("POST", `/api/config/other/${serverId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config", serverId] });
      toast({
        title: "Configuration saved",
        description: "Your configuration has been updated successfully.",
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

  const onSubmit = (data: OtherConfig) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-config" />
      </div>
    );
  }

  const selectedCategory = form.watch("category");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Other Configuration</h1>
        <p className="text-muted-foreground">Additional bot settings</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Server Category</CardTitle>
              <CardDescription>
                Select the category that best describes your server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {CATEGORIES.map((category) => {
                          const Icon = categoryIcons[category];
                          const isSelected = field.value === category;
                          
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => field.onChange(category)}
                              className={`
                                p-4 rounded-lg border-2 transition-all
                                flex flex-col items-center gap-2 text-center
                                hover-elevate active-elevate-2
                                ${isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border bg-card'
                                }
                              `}
                              data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {category}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormDescription>
                      This helps partners find servers in their niche
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
