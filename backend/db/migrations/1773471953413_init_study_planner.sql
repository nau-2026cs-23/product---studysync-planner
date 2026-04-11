-- Study Plan & Learning Schedule System - Initial Migration

CREATE TABLE IF NOT EXISTS "Courses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "code" text NOT NULL,
  "difficulty" integer NOT NULL DEFAULT 3,
  "color" text NOT NULL DEFAULT '#4F46E5',
  "source" text NOT NULL DEFAULT 'manual',
  "credits" integer NOT NULL DEFAULT 3,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "StudySessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "course_id" uuid REFERENCES "Courses"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "date" text NOT NULL,
  "start_time" text NOT NULL,
  "end_time" text NOT NULL,
  "duration_hours" decimal(4,2) NOT NULL DEFAULT 1,
  "type" text NOT NULL DEFAULT 'study',
  "ai_recommended" boolean NOT NULL DEFAULT false,
  "completed" boolean NOT NULL DEFAULT false,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "Deadlines" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "course_id" uuid REFERENCES "Courses"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "due_date" text NOT NULL,
  "type" text NOT NULL DEFAULT 'assignment',
  "priority" text NOT NULL DEFAULT 'medium',
  "completed" boolean NOT NULL DEFAULT false,
  "source" text NOT NULL DEFAULT 'manual',
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ProgressLogs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "date" text NOT NULL,
  "hours_studied" decimal(4,2) NOT NULL DEFAULT 0,
  "hours_planned" decimal(4,2) NOT NULL DEFAULT 0,
  "notes" text,
  "mood" integer DEFAULT 3,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ThesisMilestones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "target_date" text NOT NULL,
  "pages_target" integer NOT NULL DEFAULT 0,
  "pages_done" integer NOT NULL DEFAULT 0,
  "status" text NOT NULL DEFAULT 'pending',
  "order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "CollabTasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_name" text NOT NULL,
  "title" text NOT NULL,
  "assigned_to" text NOT NULL DEFAULT 'me',
  "assigned_by" text NOT NULL DEFAULT 'me',
  "status" text NOT NULL DEFAULT 'todo',
  "priority" text NOT NULL DEFAULT 'medium',
  "due_date" text,
  "description" text,
  "mentions" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "GpaEntries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "course_id" uuid REFERENCES "Courses"("id") ON DELETE CASCADE,
  "course_name" text NOT NULL,
  "credits" integer NOT NULL DEFAULT 3,
  "current_grade" decimal(5,2) NOT NULL DEFAULT 0,
  "target_grade" decimal(5,2) NOT NULL DEFAULT 90,
  "study_hours_per_week" decimal(4,2) NOT NULL DEFAULT 5,
  "semester" text NOT NULL DEFAULT 'Spring 2026',
  "created_at" timestamp DEFAULT now() NOT NULL
);
