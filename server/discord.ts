import { Client, GatewayIntentBits } from 'discord.js';

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const REDIRECT_URI = process.env.REPLIT_DOMAINS 
  ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/api/auth/callback`
  : 'http://localhost:5000/api/auth/callback';

let botClient: Client | null = null;

export async function getBotClient() {
  if (botClient && botClient.isReady()) {
    return botClient;
  }

  botClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
  });

  await botClient.login(BOT_TOKEN);
  return botClient;
}

export function getAuthUrl() {
  const scopes = 'identify guilds';
  return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}> {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

export async function getDiscordUserInfo(accessToken: string) {
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
}

export async function getDiscordUserGuilds(accessToken: string) {
  const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user guilds');
  }

  return response.json();
}

export async function checkBotInGuild(guildId: string): Promise<boolean> {
  try {
    const client = await getBotClient();
    const guild = await client.guilds.fetch(guildId).catch(() => null);
    return guild !== null;
  } catch (error) {
    console.error('Error checking bot in guild:', error);
    return false;
  }
}

export async function getDiscordGuildInfo(guildId: string) {
  try {
    const client = await getBotClient();
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

    return info;
  } catch (error) {
    console.error('Error fetching guild info:', error);
    throw error;
  }
}

export async function getDiscordGuildChannels(guildId: string) {
  try {
    const client = await getBotClient();
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

    return channelList;
  } catch (error) {
    console.error('Error fetching guild channels:', error);
    throw error;
  }
}

export function generateBotInviteUrl(guildId?: string): string {
  const permissions = '8';
  let url = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=${permissions}`;
  
  if (guildId) {
    url += `&guild_id=${guildId}&disable_guild_select=true`;
  }
  
  return url;
}
