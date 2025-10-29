const { storage } = require('./storage');
const {
  getAuthUrl,
  exchangeCodeForToken,
  getDiscordUserInfo,
  getDiscordUserGuilds,
  getDiscordGuildInfo,
  getDiscordGuildChannels,
  checkBotInGuild,
  generateBotInviteUrl,
} = require('./discord');

function requireAuth(req, res, next) {
  if (!req.session.accessToken || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

function registerRoutes(app) {
  app.get('/login', (req, res) => {
    if (req.session.accessToken && req.session.userId) {
      return res.redirect('/');
    }
    const authUrl = getAuthUrl();
    res.render('login', { authUrl, error: req.query.error });
  });

  app.get('/api/auth/callback', async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code || typeof code !== 'string') {
        return res.redirect('/login?error=no_code');
      }

      const tokenData = await exchangeCodeForToken(code);
      const userInfo = await getDiscordUserInfo(tokenData.access_token);

      req.session.accessToken = tokenData.access_token;
      req.session.refreshToken = tokenData.refresh_token;
      req.session.tokenExpiry = Date.now() + tokenData.expires_in * 1000;
      req.session.userId = userInfo.id;
      req.session.username = userInfo.username;
      req.session.avatar = userInfo.avatar;

      res.redirect('/');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('/login?error=auth_failed');
    }
  });

  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/login');
    });
  });

  app.get('/', requireAuth, (req, res) => {
    res.redirect('/servers');
  });

  app.get('/servers', requireAuth, async (req, res) => {
    try {
      const guilds = await getDiscordUserGuilds(req.session.accessToken);
      const ownedGuilds = guilds.filter(guild => guild.owner === true);
      
      const guildsWithBotStatus = await Promise.all(
        ownedGuilds.map(async (guild) => {
          const botInServer = await checkBotInGuild(guild.id);
          return { ...guild, botInServer };
        })
      );

      guildsWithBotStatus.sort((a, b) => {
        if (a.botInServer && !b.botInServer) return -1;
        if (!a.botInServer && b.botInServer) return 1;
        return 0;
      });

      res.render('server-selector', {
        user: {
          username: req.session.username,
          avatar: req.session.avatar,
          id: req.session.userId
        },
        servers: guildsWithBotStatus
      });
    } catch (error) {
      console.error('Error fetching servers:', error);
      res.render('error', { message: 'Failed to fetch servers' });
    }
  });

  app.get('/dashboard/:serverId', requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      const config = await storage.getServerConfig(serverId);
      const analytics = await storage.getAnalytics(serverId);
      const serverInfo = await getDiscordGuildInfo(serverId);

      res.render('dashboard', {
        user: { username: req.session.username, avatar: req.session.avatar },
        serverId,
        serverName: serverInfo.name,
        memberCount: serverInfo.approximate_member_count || 0,
        config,
        analytics
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      res.render('error', { message: 'Failed to load dashboard' });
    }
  });

  app.get('/analytics/:serverId', requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      const analytics = await storage.getAnalytics(serverId);
      const serverInfo = await getDiscordGuildInfo(serverId);

      res.render('analytics', {
        user: { username: req.session.username, avatar: req.session.avatar },
        serverId,
        serverName: serverInfo.name,
        analytics
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      res.render('error', { message: 'Failed to load analytics' });
    }
  });

  app.get('/config/:type/:serverId', requireAuth, async (req, res) => {
    try {
      const { serverId, type } = req.params;
      const config = await storage.getServerConfig(serverId);
      const serverInfo = await getDiscordGuildInfo(serverId);
      let channels = [];

      if (type === 'channels') {
        channels = await getDiscordGuildChannels(serverId);
      }

      res.render(`config-${type}`, {
        user: { username: req.session.username, avatar: req.session.avatar },
        serverId,
        serverName: serverInfo.name,
        config,
        channels
      });
    } catch (error) {
      console.error('Error loading config:', error);
      res.render('error', { message: 'Failed to load configuration' });
    }
  });

  app.post('/api/config/main/:serverId', requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      await storage.updateMainConfig({ serverId, ...req.body });
      res.redirect(`/config/main/${serverId}`);
    } catch (error) {
      console.error('Error updating main config:', error);
      res.status(400).send('Failed to update configuration');
    }
  });

  app.post('/api/config/channels/:serverId', requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      await storage.updateChannelConfig({ serverId, ...req.body });
      res.redirect(`/config/channels/${serverId}`);
    } catch (error) {
      console.error('Error updating channel config:', error);
      res.status(400).send('Failed to update configuration');
    }
  });

  app.post('/api/config/other/:serverId', requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      await storage.updateOtherConfig({ serverId, ...req.body });
      res.redirect(`/config/other/${serverId}`);
    } catch (error) {
      console.error('Error updating other config:', error);
      res.status(400).send('Failed to update configuration');
    }
  });

  app.post('/api/config/premium/:serverId', requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      const premiumData = {
        serverId,
        embedColor: req.body.embedColor,
        autoApprove: req.body.autoApprove === 'on',
        autoBump: req.body.autoBump === 'on',
        autoMass: req.body.autoMass === 'on',
        autoBurst: req.body.autoBurst === 'on'
      };
      await storage.updatePremiumConfig(premiumData);
      res.redirect(`/config/premium/${serverId}`);
    } catch (error) {
      console.error('Error updating premium config:', error);
      res.status(400).send('Failed to update configuration');
    }
  });

  app.get('/api/bot-invite/:serverId?', (req, res) => {
    const { serverId } = req.params;
    const url = generateBotInviteUrl(serverId);
    res.json({ url });
  });
}

module.exports = { registerRoutes };
