import {
  type ServerConfig,
  type InsertMainConfig,
  type InsertChannelConfig,
  type InsertOtherConfig,
  type InsertPremiumConfig,
  type AnalyticsData,
  type DiscordChannel,
  type ServerInfo,
} from "@shared/schema";

export interface IStorage {
  // Server Config Operations
  getServerConfig(serverId: string): Promise<ServerConfig | undefined>;
  updateMainConfig(config: InsertMainConfig): Promise<void>;
  updateChannelConfig(config: InsertChannelConfig): Promise<void>;
  updateOtherConfig(config: InsertOtherConfig): Promise<void>;
  updatePremiumConfig(config: InsertPremiumConfig): Promise<void>;
  
  // Analytics Operations
  getAnalytics(serverId: string): Promise<AnalyticsData>;
  
  // Channel Cache Operations
  getCachedChannels(serverId: string): Promise<DiscordChannel[] | undefined>;
  setCachedChannels(serverId: string, channels: DiscordChannel[]): Promise<void>;
  
  // Server Info Cache
  getCachedServerInfo(serverId: string): Promise<ServerInfo | undefined>;
  setCachedServerInfo(serverId: string, info: ServerInfo): Promise<void>;
}

export class MemStorage implements IStorage {
  private serverConfigs: Map<string, ServerConfig>;
  private analyticsData: Map<string, AnalyticsData>;
  private cachedChannels: Map<string, DiscordChannel[]>;
  private cachedServerInfo: Map<string, ServerInfo>;

  constructor() {
    this.serverConfigs = new Map();
    this.analyticsData = new Map();
    this.cachedChannels = new Map();
    this.cachedServerInfo = new Map();
  }

  async getServerConfig(serverId: string): Promise<ServerConfig | undefined> {
    return this.serverConfigs.get(serverId);
  }

  async updateMainConfig(config: InsertMainConfig): Promise<void> {
    const existing = this.serverConfigs.get(config.serverId) || { serverId: config.serverId };
    const { serverId, ...mainConfig } = config;
    this.serverConfigs.set(config.serverId, {
      ...existing,
      mainConfig,
    });
  }

  async updateChannelConfig(config: InsertChannelConfig): Promise<void> {
    const existing = this.serverConfigs.get(config.serverId) || { serverId: config.serverId };
    const { serverId, ...channelConfig } = config;
    this.serverConfigs.set(config.serverId, {
      ...existing,
      channelConfig,
    });
  }

  async updateOtherConfig(config: InsertOtherConfig): Promise<void> {
    const existing = this.serverConfigs.get(config.serverId) || { serverId: config.serverId };
    const { serverId, ...otherConfig } = config;
    this.serverConfigs.set(config.serverId, {
      ...existing,
      otherConfig,
    });
  }

  async updatePremiumConfig(config: InsertPremiumConfig): Promise<void> {
    const existing = this.serverConfigs.get(config.serverId) || { serverId: config.serverId };
    const { serverId, ...premiumConfig } = config;
    this.serverConfigs.set(config.serverId, {
      ...existing,
      premiumConfig,
    });
  }

  async getAnalytics(serverId: string): Promise<AnalyticsData> {
    let analytics = this.analyticsData.get(serverId);
    
    if (!analytics) {
      analytics = {
        serverId,
        growth: Math.floor(Math.random() * 500) + 100,
        sentRequests: Math.floor(Math.random() * 150),
        receivedRequests: Math.floor(Math.random() * 200),
        reputationScore: Math.floor(Math.random() * 50) + 50,
        totalPartnerships: Math.floor(Math.random() * 75),
        pendingRequests: Math.floor(Math.random() * 20),
        approvedRequests: Math.floor(Math.random() * 60),
        rejectedRequests: Math.floor(Math.random() * 15),
      };
      this.analyticsData.set(serverId, analytics);
    }
    
    return analytics;
  }

  async getCachedChannels(serverId: string): Promise<DiscordChannel[] | undefined> {
    return this.cachedChannels.get(serverId);
  }

  async setCachedChannels(serverId: string, channels: DiscordChannel[]): Promise<void> {
    this.cachedChannels.set(serverId, channels);
  }

  async getCachedServerInfo(serverId: string): Promise<ServerInfo | undefined> {
    return this.cachedServerInfo.get(serverId);
  }

  async setCachedServerInfo(serverId: string, info: ServerInfo): Promise<void> {
    this.cachedServerInfo.set(serverId, info);
  }
}

export const storage = new MemStorage();
