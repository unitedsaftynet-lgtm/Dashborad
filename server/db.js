class InMemoryCollection {
  constructor() {
    this.data = new Map();
  }

  async findOne(query) {
    for (const [key, value] of this.data.entries()) {
      if (this.matches(value, query)) {
        return value;
      }
    }
    return null;
  }

  async updateOne(query, update, options = {}) {
    for (const [key, value] of this.data.entries()) {
      if (this.matches(value, query)) {
        if (update.$set) {
          Object.assign(value, update.$set);
        }
        this.data.set(key, value);
        return;
      }
    }
    
    if (options.upsert) {
      const newDoc = { ...query };
      if (update.$set) {
        Object.assign(newDoc, update.$set);
      }
      const id = Object.values(query)[0] || Math.random().toString(36);
      this.data.set(id, newDoc);
    }
  }

  matches(doc, query) {
    for (const [key, value] of Object.entries(query)) {
      if (doc[key] !== value) {
        return false;
      }
    }
    return true;
  }
}

class InMemoryDB {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new InMemoryCollection());
    }
    return this.collections.get(name);
  }
}

let db;

async function connectDB() {
  if (db) return db;
  
  try {
    db = new InMemoryDB();
    console.log('Connected to in-memory database');
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

async function closeDB() {
  db = null;
}

module.exports = {
  connectDB,
  getDB,
  closeDB
};
