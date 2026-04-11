import { pgTable, text, timestamp, integer, decimal, boolean, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// ─── Courses ────────────────────────────────────────────────────────────────
export const courses = pgTable('Courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  difficulty: integer('difficulty').notNull().default(3), // 1-5
  color: text('color').notNull().default('#4F46E5'),
  source: text('source').notNull().default('manual'), // 'canvas' | 'blackboard' | 'manual'
  credits: integer('credits').notNull().default(3),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses, {
  name: z.string().min(1),
  code: z.string().min(1),
  difficulty: z.coerce.number().int().min(1).max(5),
  credits: z.coerce.number().int().min(1).max(6),
});
export const updateCourseSchema = insertCourseSchema.partial();
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// ─── Study Sessions ──────────────────────────────────────────────────────────
export const studySessions = pgTable('StudySessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  date: text('date').notNull(), // ISO date string YYYY-MM-DD
  startTime: text('start_time').notNull(), // HH:MM
  endTime: text('end_time').notNull(),   // HH:MM
  durationHours: decimal('duration_hours', { precision: 4, scale: 2 }).notNull().default('1'),
  type: text('type').notNull().default('study'), // 'study' | 'review' | 'exam' | 'group'
  aiRecommended: boolean('ai_recommended').notNull().default(false),
  completed: boolean('completed').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertStudySessionSchema = createInsertSchema(studySessions, {
  title: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  durationHours: z.coerce.string(),
});
export const updateStudySessionSchema = insertStudySessionSchema.partial();
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = typeof studySessions.$inferInsert;

// ─── Deadlines ───────────────────────────────────────────────────────────────
export const deadlines = pgTable('Deadlines', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  dueDate: text('due_date').notNull(), // ISO date string
  type: text('type').notNull().default('assignment'), // 'assignment' | 'exam' | 'project' | 'thesis'
  priority: text('priority').notNull().default('medium'), // 'low' | 'medium' | 'high' | 'urgent'
  completed: boolean('completed').notNull().default(false),
  source: text('source').notNull().default('manual'), // 'canvas' | 'blackboard' | 'manual'
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertDeadlineSchema = createInsertSchema(deadlines, {
  title: z.string().min(1),
  dueDate: z.string().min(1),
});
export const updateDeadlineSchema = insertDeadlineSchema.partial();
export type Deadline = typeof deadlines.$inferSelect;
export type InsertDeadline = typeof deadlines.$inferInsert;

// ─── Progress Logs ───────────────────────────────────────────────────────────
export const progressLogs = pgTable('ProgressLogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: text('date').notNull(), // YYYY-MM-DD
  hoursStudied: decimal('hours_studied', { precision: 4, scale: 2 }).notNull().default('0'),
  hoursPlanned: decimal('hours_planned', { precision: 4, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  mood: integer('mood').default(3), // 1-5
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertProgressLogSchema = createInsertSchema(progressLogs, {
  date: z.string().min(1),
  hoursStudied: z.coerce.string(),
  hoursPlanned: z.coerce.string(),
  mood: z.coerce.number().int().min(1).max(5).optional(),
});
export const updateProgressLogSchema = insertProgressLogSchema.partial();
export type ProgressLog = typeof progressLogs.$inferSelect;
export type InsertProgressLog = typeof progressLogs.$inferInsert;

// ─── Thesis Milestones ───────────────────────────────────────────────────────
export const thesisMilestones = pgTable('ThesisMilestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  targetDate: text('target_date').notNull(),
  pagesTarget: integer('pages_target').notNull().default(0),
  pagesDone: integer('pages_done').notNull().default(0),
  status: text('status').notNull().default('pending'), // 'pending' | 'in_progress' | 'complete'
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertThesisMilestoneSchema = createInsertSchema(thesisMilestones, {
  title: z.string().min(1),
  targetDate: z.string().min(1),
  pagesTarget: z.coerce.number().int().min(0),
  pagesDone: z.coerce.number().int().min(0),
});
export const updateThesisMilestoneSchema = insertThesisMilestoneSchema.partial();
export type ThesisMilestone = typeof thesisMilestones.$inferSelect;
export type InsertThesisMilestone = typeof thesisMilestones.$inferInsert;

// ─── Collaboration Tasks ─────────────────────────────────────────────────────
export const collabTasks = pgTable('CollabTasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectName: text('project_name').notNull(),
  title: text('title').notNull(),
  assignedTo: text('assigned_to').notNull().default('me'), // username / @handle
  assignedBy: text('assigned_by').notNull().default('me'),
  status: text('status').notNull().default('todo'), // 'todo' | 'in_progress' | 'done'
  priority: text('priority').notNull().default('medium'),
  dueDate: text('due_date'),
  description: text('description'),
  mentions: text('mentions'), // JSON array of @mentions as string
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertCollabTaskSchema = createInsertSchema(collabTasks, {
  projectName: z.string().min(1),
  title: z.string().min(1),
});
export const updateCollabTaskSchema = insertCollabTaskSchema.partial();
export type CollabTask = typeof collabTasks.$inferSelect;
export type InsertCollabTask = typeof collabTasks.$inferInsert;

// ─── GPA Entries ─────────────────────────────────────────────────────────────
export const gpaEntries = pgTable('GpaEntries', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  courseName: text('course_name').notNull(),
  credits: integer('credits').notNull().default(3),
  currentGrade: decimal('current_grade', { precision: 5, scale: 2 }).notNull().default('0'),
  targetGrade: decimal('target_grade', { precision: 5, scale: 2 }).notNull().default('90'),
  studyHoursPerWeek: decimal('study_hours_per_week', { precision: 4, scale: 2 }).notNull().default('5'),
  semester: text('semester').notNull().default('Spring 2026'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertGpaEntrySchema = createInsertSchema(gpaEntries, {
  courseName: z.string().min(1),
  credits: z.coerce.number().int().min(1).max(6),
  currentGrade: z.coerce.string(),
  targetGrade: z.coerce.string(),
  studyHoursPerWeek: z.coerce.string(),
});
export const updateGpaEntrySchema = insertGpaEntrySchema.partial();
export type GpaEntry = typeof gpaEntries.$inferSelect;
export type InsertGpaEntry = typeof gpaEntries.$inferInsert;
