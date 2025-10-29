import { Client, GatewayIntentBits } from 'discord.js';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=discord',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Discord not connected');
  }
  return accessToken;
}

export async function getUncachableDiscordClient() {
  const token = await getAccessToken();

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
  });

  await client.login(token);
  return client;
}

export async function getDiscordUserInfo() {
  const token = await getAccessToken();
  
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
}

export async function getDiscordUserGuilds() {
  const token = await getAccessToken();
  
  const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user guilds');
  }

  return response.json();
}

export async function getDiscordGuildInfo(guildId: string) {
  try {
    const client = await getUncachableDiscordClient();
    const guild = await client.guilds.fetch(guildId);
    
    const info = {
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      memberCount: guild.memberCount,
      boostLevel: guild.premiumTier,
      verificationLevel: guild.verificationLevel,
      createdAt: guild.createdAt.toISOString(),
      description: guild.description,
    };

    await client.destroy();
    return info;
  } catch (error) {
    console.error('Error fetching guild info:', error);
    throw error;
  }
}

export async function getDiscordGuildChannels(guildId: string) {
  try {
    const client = await getUncachableDiscordClient();
    const guild = await client.guilds.fetch(guildId);
    const channels = await guild.channels.fetch();
    
    const channelList = Array.from(channels.values())
      .filter(channel => channel !== null)
      .map(channel => ({
        id: channel!.id,
        name: channel!.name,
        type: channel!.type,
        position: 'position' in channel! ? channel!.position : undefined,
        parentId: channel!.parentId,
      }))
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    await client.destroy();
    return channelList;
  } catch (error) {
    console.error('Error fetching guild channels:', error);
    throw error;
  }
}
