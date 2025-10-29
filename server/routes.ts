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
  getAuthUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  getDiscordUserInfo,
  getDiscordUserGuilds,
  getDiscordGuildInfo,
  getDiscordGuildChannels,
  checkBotInGuild,
  generateBotInviteUrl,
} from "./discord";

function requireAuth(req: any, res: any, next: any) {
  if (!req.session.accessToken || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated", needsAuth: true });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/auth/url", (req, res) => {
    const authUrl = getAuthUrl();
    res.json({ url: authUrl });
  });

  app.get("/api/auth/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code || typeof code !== 'string') {
        return res.redirect('/?error=no_code');
      }

      const tokenData = await exchangeCodeForToken(code);
      const userInfo = await getDiscordUserInfo(tokenData.access_token);

      req.session.accessToken = tokenData.access_token;
      req.session.refreshToken = tokenData.refresh_token;
      req.session.tokenExpiry = Date.now() + tokenData.expires_in * 1000;
      req.session.userId = userInfo.id;

      res.redirect('/');
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect('/?error=auth_failed');
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    const isAuthenticated = !!(req.session.accessToken && req.session.userId);
    res.json({ isAuthenticated });
  });

  app.get("/api/discord/user", requireAuth, async (req, res) => {
    try {
      const userInfo = await getDiscordUserInfo(req.session.accessToken!);
      const parsedUser = discordUserSchema.parse(userInfo);
      res.json(parsedUser);
    } catch (error) {
      console.error("Error fetching Discord user:", error);
      res.status(500).json({ error: "Failed to fetch user information" });
    }
  });

  app.get("/api/discord/servers", requireAuth, async (req, res) => {
    try {
      const guilds = await getDiscordUserGuilds(req.session.accessToken!);
      
      const ownedGuilds = guilds.filter((guild: any) => guild.owner === true);
      
      const guildsWithBotStatus = await Promise.all(
        ownedGuilds.map(async (guild: any) => {
          const botInServer = await checkBotInGuild(guild.id);
          return {
            ...guild,
            botInServer,
          };
        })
      );

      guildsWithBotStatus.sort((a: any, b: any) => {
        if (a.botInServer && !b.botInServer) return -1;
        if (!a.botInServer && b.botInServer) return 1;
        return 0;
      });

      const parsedGuilds = guildsWithBotStatus.map((guild: any) => discordServerSchema.parse(guild));
      res.json(parsedGuilds);
    } catch (error) {
      console.error("Error fetching Discord servers:", error);
      res.status(500).json({ error: "Failed to fetch servers" });
    }
  });

  app.get("/api/discord/server-info/:serverId", requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      
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

  app.get("/api/discord/channels/:serverId", requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      
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

  app.get("/api/discord/bot-invite/:serverId?", (req, res) => {
    const { serverId } = req.params;
    const inviteUrl = generateBotInviteUrl(serverId);
    res.json({ url: inviteUrl });
  });

  app.get("/api/config/:serverId", requireAuth, async (req, res) => {
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

  app.post("/api/config/main/:serverId", requireAuth, async (req, res) => {
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

  app.post("/api/config/channels/:serverId", requireAuth, async (req, res) => {
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

  app.post("/api/config/other/:serverId", requireAuth, async (req, res) => {
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

  app.post("/api/config/premium/:serverId", requireAuth, async (req, res) => {
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

  app.get("/api/analytics/:serverId", requireAuth, async (req, res) => {
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
