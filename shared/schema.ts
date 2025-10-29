import { z } from "zod";

// Discord User Schema
export const discordUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  email: z.string().email().optional(),
});

export type DiscordUser = z.infer<typeof discordUserSchema>;

// Discord Server/Guild Schema
export const discordServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  owner: z.boolean(),
  permissions: z.string(),
  features: z.array(z.string()),
  botInServer: z.boolean().default(false),
});

export type DiscordServer = z.infer<typeof discordServerSchema>;

// Discord Channel Schema
export const discordChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.number(),
  position: z.number().optional(),
  parentId: z.string().nullable().optional(),
});

export type DiscordChannel = z.infer<typeof discordChannelSchema>;

// Main Config Schema
export const mainConfigSchema = z.object({
  adTitle: z.string().min(1, "Ad title is required").max(256, "Title too long"),
  adDescription: z.string().min(1, "Description is required").max(4000, "Description must be 4000 characters or less"),
  adInviteLink: z.string().url("Must be a valid Discord invite link"),
  adOtherLinks: z.array(z.string().url("Must be a valid URL")).max(2, "Maximum 2 additional links"),
  adBanner: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
});

export const insertMainConfigSchema = mainConfigSchema.extend({
  serverId: z.string(),
});

export type MainConfig = z.infer<typeof mainConfigSchema>;
export type InsertMainConfig = z.infer<typeof insertMainConfigSchema>;

// Channel Config Schema
export const channelConfigSchema = z.object({
  partnerChannel: z.string().nullable(),
  reviewChannel: z.string().nullable(),
  bumpChannel: z.string().nullable(),
  logChannel: z.string().nullable(),
});

export const insertChannelConfigSchema = channelConfigSchema.extend({
  serverId: z.string(),
});

export type ChannelConfig = z.infer<typeof channelConfigSchema>;
export type InsertChannelConfig = z.infer<typeof insertChannelConfigSchema>;

// Other Config Schema
export const otherConfigSchema = z.object({
  category: z.string().min(1, "Category is required"),
});

export const insertOtherConfigSchema = otherConfigSchema.extend({
  serverId: z.string(),
});

export type OtherConfig = z.infer<typeof otherConfigSchema>;
export type InsertOtherConfig = z.infer<typeof insertOtherConfigSchema>;

// Premium Config Schema
export const premiumConfigSchema = z.object({
  embedColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  autoApprove: z.boolean(),
  autoBump: z.boolean(),
  autoMass: z.boolean(),
  autoBurst: z.boolean(),
});

export const insertPremiumConfigSchema = premiumConfigSchema.extend({
  serverId: z.string(),
});

export type PremiumConfig = z.infer<typeof premiumConfigSchema>;
export type InsertPremiumConfig = z.infer<typeof insertPremiumConfigSchema>;

// Combined Server Config
export const serverConfigSchema = z.object({
  serverId: z.string(),
  mainConfig: mainConfigSchema.optional(),
  channelConfig: channelConfigSchema.optional(),
  otherConfig: otherConfigSchema.optional(),
  premiumConfig: premiumConfigSchema.optional(),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

// Analytics Data Schema
export const analyticsDataSchema = z.object({
  serverId: z.string(),
  growth: z.number(),
  sentRequests: z.number(),
  receivedRequests: z.number(),
  reputationScore: z.number(),
  totalPartnerships: z.number(),
  pendingRequests: z.number(),
  approvedRequests: z.number(),
  rejectedRequests: z.number(),
});

export type AnalyticsData = z.infer<typeof analyticsDataSchema>;

// Server Info Schema (from Discord API)
export const serverInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  memberCount: z.number(),
  boostLevel: z.number(),
  verificationLevel: z.number(),
  createdAt: z.string(),
  description: z.string().nullable(),
});

export type ServerInfo = z.infer<typeof serverInfoSchema>;

// Categories for Other Config
export const CATEGORIES = [
  "Gaming",
  "Technology",
  "Music",
  "Education",
  "Community",
  "Entertainment",
  "Art & Design",
  "Business",
  "Lifestyle",
  "Other"
] as const;

export type Category = typeof CATEGORIES[number];
