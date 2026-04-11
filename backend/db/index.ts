import { config } from 'dotenv';

// Ensure environment variables are loaded
config();

// In-memory storage for development
const storage = {
  users: [],
  courses: [],
  studySessions: [],
  deadlines: [],
  progressLogs: [],
  thesisMilestones: [],
  collabTasks: [],
  gpaEntries: []
};

// Simple database interface
export const db = {
  insert: async (table, data) => {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const item = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    storage[table].push(item);
    return item;
  },
  select: async (table, where) => {
    if (!where) return storage[table];
    return storage[table].filter(item => {
      for (const [key, value] of Object.entries(where)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  },
  update: async (table, where, data) => {
    const items = storage[table];
    for (let i = 0; i < items.length; i++) {
      let match = true;
      for (const [key, value] of Object.entries(where)) {
        if (items[i][key] !== value) {
          match = false;
          break;
        }
      }
      if (match) {
        items[i] = { ...items[i], ...data, updatedAt: new Date().toISOString() };
        return items[i];
      }
    }
    return null;
  },
  delete: async (table, where) => {
    const items = storage[table];
    const initialLength = items.length;
    storage[table] = items.filter(item => {
      for (const [key, value] of Object.entries(where)) {
        if (item[key] !== value) return true;
      }
      return false;
    });
    return initialLength - storage[table].length;
  }
};

export { storage };
