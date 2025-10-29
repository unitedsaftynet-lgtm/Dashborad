const { getDB } = require('./db');

class MongoStorage {
  async getServerConfig(serverId) {
    const db = await getDB();
    const config = await db.collection('server_configs').findOne({ serverId });
    return config || { serverId };
  }

  async updateMainConfig(data) {
    const db = await getDB();
    await db.collection('server_configs').updateOne(
      { serverId: data.serverId },
      { 
        $set: { 
          'mainConfig': {
            adTitle: data.adTitle,
            adDescription: data.adDescription,
            adInviteLink: data.adInviteLink,
            adOtherLinks: data.adOtherLinks,
            adBanner: data.adBanner
          },
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
  }

  async updateChannelConfig(data) {
    const db = await getDB();
    await db.collection('server_configs').updateOne(
      { serverId: data.serverId },
      { 
        $set: { 
          'channelConfig': {
            partnerChannel: data.partnerChannel,
            reviewChannel: data.reviewChannel,
            bumpChannel: data.bumpChannel,
            logChannel: data.logChannel
          },
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
  }

  async updateOtherConfig(data) {
    const db = await getDB();
    await db.collection('server_configs').updateOne(
      { serverId: data.serverId },
      { 
        $set: { 
          'otherConfig': {
            category: data.category
          },
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
  }

  async updatePremiumConfig(data) {
    const db = await getDB();
    await db.collection('server_configs').updateOne(
      { serverId: data.serverId },
      { 
        $set: { 
          'premiumConfig': {
            embedColor: data.embedColor,
            autoApprove: data.autoApprove,
            autoBump: data.autoBump,
            autoMass: data.autoMass,
            autoBurst: data.autoBurst
          },
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
  }

  async getAnalytics(serverId) {
    return {
      serverId,
      growth: Math.floor(Math.random() * 1000) + 100,
      sentRequests: Math.floor(Math.random() * 50) + 10,
      receivedRequests: Math.floor(Math.random() * 50) + 10,
      reputationScore: Math.floor(Math.random() * 100),
      totalPartnerships: Math.floor(Math.random() * 30) + 5,
      pendingRequests: Math.floor(Math.random() * 10),
      approvedRequests: Math.floor(Math.random() * 20) + 5,
      rejectedRequests: Math.floor(Math.random() * 5)
    };
  }

  async getCachedServerInfo(serverId) {
    const db = await getDB();
    const cached = await db.collection('server_info_cache').findOne({ serverId });
    if (cached && Date.now() - cached.cachedAt < 3600000) {
      return cached.data;
    }
    return null;
  }

  async setCachedServerInfo(serverId, data) {
    const db = await getDB();
    await db.collection('server_info_cache').updateOne(
      { serverId },
      { $set: { data, cachedAt: Date.now() } },
      { upsert: true }
    );
  }

  async getCachedChannels(serverId) {
    const db = await getDB();
    const cached = await db.collection('channels_cache').findOne({ serverId });
    if (cached && Date.now() - cached.cachedAt < 3600000) {
      return cached.data;
    }
    return null;
  }

  async setCachedChannels(serverId, data) {
    const db = await getDB();
    await db.collection('channels_cache').updateOne(
      { serverId },
      { $set: { data, cachedAt: Date.now() } },
      { upsert: true }
    );
  }
}

const storage = new MongoStorage();

module.exports = { storage };
