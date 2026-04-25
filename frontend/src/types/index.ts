// ─── API Response ────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────────
export type AppView = 'landing' | 'dashboard' | 'vault' | 'drafts' | 'recent' | 'schedule' | 'progress' | 'collab' | 'integrations' | 'gpa' | 'pdf' | 'tags' | 'flashcards' | 'ai' | 'focus' | 'subjects' | 'semesters' | 'settings';

// ─── Course ─────────────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  name: string;
  code: string;
  difficulty: number;
  color: string;
  source: string;
  credits: number;
  createdAt: string;
}

// ─── Study Session ────────────────────────────────────────────────────────────
export interface StudySession {
  id: string;
  courseId: string | null;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: string;
  type: string;
  aiRecommended: boolean;
  completed: boolean;
  notes: string | null;
  createdAt: string;
}

// ─── Deadline ────────────────────────────────────────────────────────────────────
export interface Deadline {
  id: string;
  courseId: string | null;
  title: string;
  dueDate: string;
  type: string;
  priority: string;
  completed: boolean;
  source: string;
  description: string | null;
  createdAt: string;
}

// ─── Progress Log ─────────────────────────────────────────────────────────────
export interface ProgressLog {
  id: string;
  date: string;
  hoursStudied: string;
  hoursPlanned: string;
  notes: string | null;
  mood: number | null;
  createdAt: string;
}

// ─── Thesis Milestone ─────────────────────────────────────────────────────────
export interface ThesisMilestone {
  id: string;
  title: string;
  targetDate: string;
  pagesTarget: number;
  pagesDone: number;
  status: string;
  order: number;
  createdAt: string;
}

// ─── Collab Task ───────────────────────────────────────────────────────────────
export interface CollabTask {
  id: string;
  projectName: string;
  title: string;
  assignedTo: string;
  assignedBy: string;
  status: string;
  priority: string;
  dueDate: string | null;
  description: string | null;
  mentions: string | null;
  createdAt: string;
}

// ─── GPA Entry ──────────────────────────────────────────────────────────────────
export interface GpaEntry {
  id: string;
  courseId: string | null;
  courseName: string;
  credits: number;
  currentGrade: string;
  targetGrade: string;
  studyHoursPerWeek: string;
  semester: string;
  createdAt: string;
}

// ─── Team Task ──────────────────────────────────────────────────────────────────
export interface TeamTask {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  priority: string;
  dueDate: string;
  assignedTo: string | null;
  status: string;
  createdAt: string;
}

// ─── Team Member ────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// ─── Integration ────────────────────────────────────────────────────────────────
export interface Integration {
  id: string;
  userId: string;
  type: string;
  name: string;
  status: string;
  apiKey: string;
  settings: Record<string, any>;
  createdAt: string;
}



// ─── Form types ─────────────────────────────────────────────────────────────────
export interface SessionFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: string;
  type: string;
  courseId: string;
  notes: string;
  aiRecommended: boolean;
}

export interface DeadlineFormData {
  title: string;
  dueDate: string;
  type: string;
  priority: string;
  courseId: string;
  description: string;
  source: string;
}

export interface CollabTaskFormData {
  projectName: string;
  title: string;
  assignedTo: string;
  assignedBy: string;
  status: string;
  priority: string;
  dueDate: string;
  description: string;
  mentions: string;
}

export interface GpaFormData {
  courseName: string;
  credits: number;
  currentGrade: string;
  targetGrade: string;
  studyHoursPerWeek: string;
  semester: string;
}
