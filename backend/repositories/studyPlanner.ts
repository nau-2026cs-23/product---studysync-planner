import { db } from '../db/index';
import { z } from 'zod';

// ─── Courses ─────────────────────────────────────────────────────────────────
export const coursesRepo = {
  async getAll() {
    return db.select('courses', {}).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
  async create(data: any) {
    return db.insert('courses', data);
  },
  async update(id: string, data: any) {
    return db.update('courses', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('courses', { id });
    return result.length > 0;
  },
};

// ─── Study Sessions ───────────────────────────────────────────────────────────
export const studySessionsRepo = {
  async getAll() {
    return db.select('studySessions', {}).sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff === 0) {
        return a.startTime.localeCompare(b.startTime);
      }
      return dateDiff;
    });
  },
  async getByDate(date: string) {
    return db.select('studySessions', { date }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  },
  async create(data: any) {
    return db.insert('studySessions', data);
  },
  async update(id: string, data: any) {
    return db.update('studySessions', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('studySessions', { id });
    return result.length > 0;
  },
};

// ─── Deadlines ────────────────────────────────────────────────────────────────
export const deadlinesRepo = {
  async getAll() {
    return db.select('deadlines', {}).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },
  async create(data: any) {
    return db.insert('deadlines', data);
  },
  async update(id: string, data: any) {
    return db.update('deadlines', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('deadlines', { id });
    return result.length > 0;
  },
};

// ─── Progress Logs ────────────────────────────────────────────────────────────
export const progressLogsRepo = {
  async getAll() {
    return db.select('progressLogs', {}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  async getByDate(date: string) {
    const results = db.select('progressLogs', { date });
    return results.length > 0 ? results[0] : null;
  },
  async upsert(data: any) {
    const existing = await progressLogsRepo.getByDate(data.date);
    if (existing) {
      return db.update('progressLogs', { date: data.date }, data);
    }
    return db.insert('progressLogs', data);
  },
  async delete(id: string) {
    const result = db.delete('progressLogs', { id });
    return result.length > 0;
  },
};

// ─── Thesis Milestones ────────────────────────────────────────────────────────
export const thesisMilestonesRepo = {
  async getAll() {
    return db.select('thesisMilestones', {}).sort((a, b) => a.order - b.order);
  },
  async create(data: any) {
    return db.insert('thesisMilestones', data);
  },
  async update(id: string, data: any) {
    return db.update('thesisMilestones', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('thesisMilestones', { id });
    return result.length > 0;
  },
};

// ─── Collab Tasks ─────────────────────────────────────────────────────────────
export const collabTasksRepo = {
  async getAll() {
    return db.select('collabTasks', {}).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  async create(data: any) {
    return db.insert('collabTasks', data);
  },
  async update(id: string, data: any) {
    return db.update('collabTasks', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('collabTasks', { id });
    return result.length > 0;
  },
};

// ─── GPA Entries ──────────────────────────────────────────────────────────────
export const gpaEntriesRepo = {
  async getAll() {
    return db.select('gpaEntries', {}).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
  async create(data: any) {
    return db.insert('gpaEntries', data);
  },
  async update(id: string, data: any) {
    return db.update('gpaEntries', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('gpaEntries', { id });
    return result.length > 0;
  },
};

// ─── Notes ───────────────────────────────────────────────────────────────────
export const notesRepo = {
  async getAll() {
    return db.select('notes', {}).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
  async create(data: any) {
    return db.insert('notes', data);
  },
  async update(id: string, data: any) {
    return db.update('notes', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('notes', { id });
    return result.length > 0;
  },
};

// ─── Drafts ──────────────────────────────────────────────────────────────────
export const draftsRepo = {
  async getAll() {
    return db.select('drafts', {}).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
  async create(data: any) {
    return db.insert('drafts', data);
  },
  async update(id: string, data: any) {
    return db.update('drafts', { id }, data);
  },
  async delete(id: string) {
    const result = db.delete('drafts', { id });
    return result.length > 0;
  },
};
