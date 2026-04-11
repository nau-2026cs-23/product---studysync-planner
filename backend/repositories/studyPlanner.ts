import { db } from '../db/index';
import {
  courses, studySessions, deadlines, progressLogs, thesisMilestones, collabTasks, gpaEntries,
  insertCourseSchema, insertStudySessionSchema, insertDeadlineSchema,
  insertProgressLogSchema, insertThesisMilestoneSchema, insertCollabTaskSchema, insertGpaEntrySchema,
  InsertCourse, InsertStudySession, InsertDeadline, InsertProgressLog,
  InsertThesisMilestone, InsertCollabTask, InsertGpaEntry,
} from '../db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { z } from 'zod';

// ─── Courses ─────────────────────────────────────────────────────────────────
export const coursesRepo = {
  async getAll() {
    return db.select().from(courses).orderBy(asc(courses.createdAt));
  },
  async create(data: z.infer<typeof insertCourseSchema>) {
    const [row] = await db.insert(courses).values(data as InsertCourse).returning();
    return row;
  },
  async update(id: string, data: z.infer<typeof insertCourseSchema>) {
    const [row] = await db.update(courses).set(data as Partial<InsertCourse>).where(eq(courses.id, id)).returning();
    return row;
  },
  async delete(id: string) {
    const result = await db.delete(courses).where(eq(courses.id, id)).returning();
    return result.length > 0;
  },
};

// ─── Study Sessions ───────────────────────────────────────────────────────────
export const studySessionsRepo = {
  async getAll() {
    return db.select().from(studySessions).orderBy(asc(studySessions.date), asc(studySessions.startTime));
  },
  async getByDate(date: string) {
    return db.select().from(studySessions).where(eq(studySessions.date, date)).orderBy(asc(studySessions.startTime));
  },
  async create(data: z.infer<typeof insertStudySessionSchema>) {
    const [row] = await db.insert(studySessions).values(data as InsertStudySession).returning();
    return row;
  },
  async update(id: string, data: z.infer<typeof insertStudySessionSchema>) {
    const [row] = await db.update(studySessions).set(data as Partial<InsertStudySession>).where(eq(studySessions.id, id)).returning();
    return row;
  },
  async delete(id: string) {
    const result = await db.delete(studySessions).where(eq(studySessions.id, id)).returning();
    return result.length > 0;
  },
};

// ─── Deadlines ────────────────────────────────────────────────────────────────
export const deadlinesRepo = {
  async getAll() {
    return db.select().from(deadlines).orderBy(asc(deadlines.dueDate));
  },
  async create(data: z.infer<typeof insertDeadlineSchema>) {
    const [row] = await db.insert(deadlines).values(data as InsertDeadline).returning();
    return row;
  },
  async update(id: string, data: z.infer<typeof insertDeadlineSchema>) {
    const [row] = await db.update(deadlines).set(data as Partial<InsertDeadline>).where(eq(deadlines.id, id)).returning();
    return row;
  },
  async delete(id: string) {
    const result = await db.delete(deadlines).where(eq(deadlines.id, id)).returning();
    return result.length > 0;
  },
};

// ─── Progress Logs ────────────────────────────────────────────────────────────
export const progressLogsRepo = {
  async getAll() {
    return db.select().from(progressLogs).orderBy(desc(progressLogs.date));
  },
  async getByDate(date: string) {
    const [row] = await db.select().from(progressLogs).where(eq(progressLogs.date, date));
    return row || null;
  },
  async upsert(data: z.infer<typeof insertProgressLogSchema>) {
    const existing = await progressLogsRepo.getByDate(data.date as string);
    if (existing) {
      const [row] = await db.update(progressLogs).set(data as Partial<InsertProgressLog>).where(eq(progressLogs.date, data.date as string)).returning();
      return row;
    }
    const [row] = await db.insert(progressLogs).values(data as InsertProgressLog).returning();
    return row;
  },
  async delete(id: string) {
    const result = await db.delete(progressLogs).where(eq(progressLogs.id, id)).returning();
    return result.length > 0;
  },
};

// ─── Thesis Milestones ────────────────────────────────────────────────────────
export const thesisMilestonesRepo = {
  async getAll() {
    return db.select().from(thesisMilestones).orderBy(asc(thesisMilestones.order));
  },
  async create(data: z.infer<typeof insertThesisMilestoneSchema>) {
    const [row] = await db.insert(thesisMilestones).values(data as InsertThesisMilestone).returning();
    return row;
  },
  async update(id: string, data: z.infer<typeof insertThesisMilestoneSchema>) {
    const [row] = await db.update(thesisMilestones).set(data as Partial<InsertThesisMilestone>).where(eq(thesisMilestones.id, id)).returning();
    return row;
  },
  async delete(id: string) {
    const result = await db.delete(thesisMilestones).where(eq(thesisMilestones.id, id)).returning();
    return result.length > 0;
  },
};

// ─── Collab Tasks ─────────────────────────────────────────────────────────────
export const collabTasksRepo = {
  async getAll() {
    return db.select().from(collabTasks).orderBy(desc(collabTasks.createdAt));
  },
  async create(data: z.infer<typeof insertCollabTaskSchema>) {
    const [row] = await db.insert(collabTasks).values(data as InsertCollabTask).returning();
    return row;
  },
  async update(id: string, data: z.infer<typeof insertCollabTaskSchema>) {
    const [row] = await db.update(collabTasks).set(data as Partial<InsertCollabTask>).where(eq(collabTasks.id, id)).returning();
    return row;
  },
  async delete(id: string) {
    const result = await db.delete(collabTasks).where(eq(collabTasks.id, id)).returning();
    return result.length > 0;
  },
};

// ─── GPA Entries ──────────────────────────────────────────────────────────────
export const gpaEntriesRepo = {
  async getAll() {
    return db.select().from(gpaEntries).orderBy(asc(gpaEntries.createdAt));
  },
  async create(data: z.infer<typeof insertGpaEntrySchema>) {
    const [row] = await db.insert(gpaEntries).values(data as InsertGpaEntry).returning();
    return row;
  },
  async update(id: string, data: z.infer<typeof insertGpaEntrySchema>) {
    const [row] = await db.update(gpaEntries).set(data as Partial<InsertGpaEntry>).where(eq(gpaEntries.id, id)).returning();
    return row;
  },
  async delete(id: string) {
    const result = await db.delete(gpaEntries).where(eq(gpaEntries.id, id)).returning();
    return result.length > 0;
  },
};
