import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  mainConfigSchema,
  channelConfigSchema,
  otherConfigSchema,
  premiumConfigSchema,
  discordUserSchema,
  discordServerSchema,
} from "@shared/schema";
import {
  getDiscordUserInfo,
  getDiscordUserGuilds,
  getDiscordGuildInfo,
  getDiscordGuildChannels,
} from "./discord";

export async function registerRoutes(app: Express): Promise<Server> {
  // Discord authentication and user info
  app.get("/api/discord/user", async (req, res) => {
    try {
      const userInfo = await getDiscordUserInfo();
      const parsedUser = discordUserSchema.parse(userInfo);
      res.json(parsedUser);
    } catch (error) {
      console.error("Error fetching Discord user:", error);
      res.status(500).json({ error: "Failed to fetch user information" });
    }
  });

  // Get user's Discord servers
  app.get("/api/discord/servers", async (req, res) => {
    try {
      const guilds = await getDiscordUserGuilds();
      const parsedGuilds = guilds.map((guild: any) => discordServerSchema.parse(guild));
      res.json(parsedGuilds);
    } catch (error) {
      console.error("Error fetching Discord servers:", error);
      res.status(500).json({ error: "Failed to fetch servers" });
    }
  });

  // Get specific server info
  app.get("/api/discord/server-info/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      
      // Check cache first
      let serverInfo = await storage.getCachedServerInfo(serverId);
      
      if (!serverInfo) {
        const info = await getDiscordGuildInfo(serverId);
        serverInfo = info;
        await storage.setCachedServerInfo(serverId, info);
      }
      
      res.json(serverInfo);
    } catch (error) {
      console.error("Error fetching server info:", error);
      res.status(500).json({ error: "Failed to fetch server information" });
    }
  });

  // Get server channels
  app.get("/api/discord/channels/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      
      // Check cache first
      let channels = await storage.getCachedChannels(serverId);
      
      if (!channels) {
        channels = await getDiscordGuildChannels(serverId);
        await storage.setCachedChannels(serverId, channels);
      }
      
      res.json(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  // Get server configuration
  app.get("/api/config/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      const config = await storage.getServerConfig(serverId);
      
      if (!config) {
        res.json({ serverId });
        return;
      }
      
      res.json(config);
    } catch (error) {
      console.error("Error fetching config:", error);
      res.status(500).json({ error: "Failed to fetch configuration" });
    }
  });

  // Update main config
  app.post("/api/config/main/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      const validatedData = mainConfigSchema.parse(req.body);
      
      await storage.updateMainConfig({
        serverId,
        ...validatedData,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating main config:", error);
      res.status(400).json({ error: "Failed to update configuration" });
    }
  });

  // Update channel config
  app.post("/api/config/channels/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      const validatedData = channelConfigSchema.parse(req.body);
      
      await storage.updateChannelConfig({
        serverId,
        ...validatedData,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating channel config:", error);
      res.status(400).json({ error: "Failed to update configuration" });
    }
  });

  // Update other config
  app.post("/api/config/other/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      const validatedData = otherConfigSchema.parse(req.body);
      
      await storage.updateOtherConfig({
        serverId,
        ...validatedData,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating other config:", error);
      res.status(400).json({ error: "Failed to update configuration" });
    }
  });

  // Update premium config
  app.post("/api/config/premium/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      const validatedData = premiumConfigSchema.parse(req.body);
      
      await storage.updatePremiumConfig({
        serverId,
        ...validatedData,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating premium config:", error);
      res.status(400).json({ error: "Failed to update configuration" });
    }
  });

  // Get analytics data
  app.get("/api/analytics/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      const analytics = await storage.getAnalytics(serverId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
