import { config } from 'dotenv';

config();

const storage: Record<string, any[]> = {
  users: [],
  courses: [],
  studySessions: [],
  deadlines: [],
  progressLogs: [],
  thesisMilestones: [],
  collabTasks: [],
  gpaEntries: []
};

class QueryBuilder {
  private tableName: string;
  private whereConditions: Record<string, any> | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  where(conditions: Record<string, any>): this {
    this.whereConditions = conditions;
    return this;
  }

  returning(): any[] {
    let items = [...storage[this.tableName] || []];

    if (this.whereConditions) {
      items = items.filter(item => {
        for (const [key, value] of Object.entries(this.whereConditions!)) {
          if (item[key] !== value) return false;
        }
        return true;
      });
    }

    return items;
  }
}

export const db = {
  select: (table: string, conditions?: Record<string, any>): any[] => {
    const builder = new QueryBuilder(table);
    if (conditions) {
      builder.where(conditions);
    }
    return builder.returning();
  },
  
  insert: (table: string, data: Record<string, any>): any => {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const item = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    storage[table].push(item);
    return item;
  },
  
  update: (table: string, conditions: Record<string, any>, data: Record<string, any>): any => {
    const items = storage[table];
    for (let i = 0; i < items.length; i++) {
      let match = true;
      for (const [key, value] of Object.entries(conditions)) {
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
  
  delete: (table: string, conditions: Record<string, any>): any[] => {
    const items = storage[table];
    const deleted: any[] = [];
    storage[table] = items.filter(item => {
      let match = true;
      for (const [key, value] of Object.entries(conditions)) {
        if (item[key] !== value) {
          match = false;
          break;
        }
      }
      if (!match) return true;
      deleted.push(item);
      return false;
    });
    return deleted;
  }
};

export { storage };
