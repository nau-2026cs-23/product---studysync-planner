import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Helper function to generate UUID-like string
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// ─── Courses ────────────────────────────────────────────────────────────────
export const courses = sqliteTable('Courses', {
  id: text('id').primaryKey().default(() => generateId()),
  name: text('name').notNull(),
  code: text('code').notNull(),
  difficulty: integer('difficulty').notNull().default(3), // 1-5
  color: text('color').notNull().default('#4F46E5'),
  source: text('source').notNull().default('manual'), // 'canvas' | 'blackboard' | 'manual'
  credits: integer('credits').notNull().default(3),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
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
export const studySessions = sqliteTable('StudySessions', {
  id: text('id').primaryKey().default(() => generateId()),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  date: text('date').notNull(), // ISO date string YYYY-MM-DD
  startTime: text('start_time').notNull(), // HH:MM
  endTime: text('end_time').notNull(),   // HH:MM
  durationHours: text('duration_hours').notNull().default('1'),
  type: text('type').notNull().default('study'), // 'study' | 'review' | 'exam' | 'group'
  aiRecommended: integer('ai_recommended').notNull().default(0),
  completed: integer('completed').notNull().default(0),
  notes: text('notes'),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
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
export const deadlines = sqliteTable('Deadlines', {
  id: text('id').primaryKey().default(() => generateId()),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  dueDate: text('due_date').notNull(), // ISO date string
  type: text('type').notNull().default('assignment'), // 'assignment' | 'exam' | 'project' | 'thesis'
  priority: text('priority').notNull().default('medium'), // 'low' | 'medium' | 'high' | 'urgent'
  completed: integer('completed').notNull().default(0),
  source: text('source').notNull().default('manual'), // 'canvas' | 'blackboard' | 'manual'
  description: text('description'),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
});

export const insertDeadlineSchema = createInsertSchema(deadlines, {
  title: z.string().min(1),
  dueDate: z.string().min(1),
});
export const updateDeadlineSchema = insertDeadlineSchema.partial();
export type Deadline = typeof deadlines.$inferSelect;
export type InsertDeadline = typeof deadlines.$inferInsert;

// ─── Progress Logs ───────────────────────────────────────────────────────────
export const progressLogs = sqliteTable('ProgressLogs', {
  id: text('id').primaryKey().default(() => generateId()),
  date: text('date').notNull(), // YYYY-MM-DD
  hoursStudied: text('hours_studied').notNull().default('0'),
  hoursPlanned: text('hours_planned').notNull().default('0'),
  notes: text('notes'),
  mood: integer('mood').default(3), // 1-5
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
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
export const thesisMilestones = sqliteTable('ThesisMilestones', {
  id: text('id').primaryKey().default(() => generateId()),
  title: text('title').notNull(),
  targetDate: text('target_date').notNull(),
  pagesTarget: integer('pages_target').notNull().default(0),
  pagesDone: integer('pages_done').notNull().default(0),
  status: text('status').notNull().default('pending'), // 'pending' | 'in_progress' | 'complete'
  order: integer('order').notNull().default(0),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
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
export const collabTasks = sqliteTable('CollabTasks', {
  id: text('id').primaryKey().default(() => generateId()),
  projectName: text('project_name').notNull(),
  title: text('title').notNull(),
  assignedTo: text('assigned_to').notNull().default('me'), // username / @handle
  assignedBy: text('assigned_by').notNull().default('me'),
  status: text('status').notNull().default('todo'), // 'todo' | 'in_progress' | 'done'
  priority: text('priority').notNull().default('medium'),
  dueDate: text('due_date'),
  description: text('description'),
  mentions: text('mentions'), // JSON array of @mentions as string
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
});

export const insertCollabTaskSchema = createInsertSchema(collabTasks, {
  projectName: z.string().min(1),
  title: z.string().min(1),
});
export const updateCollabTaskSchema = insertCollabTaskSchema.partial();
export type CollabTask = typeof collabTasks.$inferSelect;
export type InsertCollabTask = typeof collabTasks.$inferInsert;

// ─── GPA Entries ─────────────────────────────────────────────────────────────
export const gpaEntries = sqliteTable('GpaEntries', {
  id: text('id').primaryKey().default(() => generateId()),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  courseName: text('course_name').notNull(),
  credits: integer('credits').notNull().default(3),
  currentGrade: text('current_grade').notNull().default('0'),
  targetGrade: text('target_grade').notNull().default('90'),
  studyHoursPerWeek: text('study_hours_per_week').notNull().default('5'),
  semester: text('semester').notNull().default('Spring 2026'),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
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

// ─── Notes ───────────────────────────────────────────────────────────────────
export const notes = sqliteTable('Notes', {
  id: text('id').primaryKey().default(() => generateId()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  subject: text('subject'),
  subjectId: text('subject_id'),
  semester: text('semester'),
  tags: text('tags'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
  updatedAt: text('updated_at').default(() => new Date().toISOString()).notNull(),
});

export const insertNoteSchema = createInsertSchema(notes, {
  title: z.string().min(1),
  content: z.string().min(1),
});
export const updateNoteSchema = insertNoteSchema.partial();
export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

// ─── Drafts ──────────────────────────────────────────────────────────────────
export const drafts = sqliteTable('Drafts', {
  id: text('id').primaryKey().default(() => generateId()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  semesterId: text('semester_id'),
  subjectId: text('subject_id'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
  updatedAt: text('updated_at').default(() => new Date().toISOString()).notNull(),
});

export const insertDraftSchema = createInsertSchema(drafts, {
  title: z.string().min(1),
  content: z.string().min(1),
});
export const updateDraftSchema = insertDraftSchema.partial();
export type Draft = typeof drafts.$inferSelect;
export type InsertDraft = typeof drafts.$inferInsert;

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = sqliteTable('Users', {
  id: text('id').primaryKey().default(() => generateId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(() => new Date().toISOString()).notNull(),
  updatedAt: text('updated_at').default(() => new Date().toISOString()).notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(6),
});
export const loginUserSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(6),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;


