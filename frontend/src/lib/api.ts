import { API_BASE_URL } from '@/config/constants';
import type {
  ApiResponse, Course, StudySession, Deadline, ProgressLog,
  ThesisMilestone, CollabTask, GpaEntry,
} from '@/types';

const BASE = `${API_BASE_URL}/api/planner`;

async function req<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json() as Promise<ApiResponse<T>>;
}

// ─── Courses ──────────────────────────────────────────────────────────────────
export const getCourses = () => req<Course[]>(`${BASE}/courses`);
export const createCourse = (data: Partial<Course>) => req<Course>(`${BASE}/courses`, { method: 'POST', body: JSON.stringify(data) });
export const updateCourse = (id: string, data: Partial<Course>) => req<Course>(`${BASE}/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCourse = (id: string) => req<null>(`${BASE}/courses/${id}`, { method: 'DELETE' });

// ─── Study Sessions ───────────────────────────────────────────────────────────
export const getSessions = () => req<StudySession[]>(`${BASE}/sessions`);
export const createSession = (data: Partial<StudySession>) => req<StudySession>(`${BASE}/sessions`, { method: 'POST', body: JSON.stringify(data) });
export const updateSession = (id: string, data: Partial<StudySession>) => req<StudySession>(`${BASE}/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSession = (id: string) => req<null>(`${BASE}/sessions/${id}`, { method: 'DELETE' });

// ─── Deadlines ────────────────────────────────────────────────────────────────
export const getDeadlines = () => req<Deadline[]>(`${BASE}/deadlines`);
export const createDeadline = (data: Partial<Deadline>) => req<Deadline>(`${BASE}/deadlines`, { method: 'POST', body: JSON.stringify(data) });
export const updateDeadline = (id: string, data: Partial<Deadline>) => req<Deadline>(`${BASE}/deadlines/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDeadline = (id: string) => req<null>(`${BASE}/deadlines/${id}`, { method: 'DELETE' });

// ─── Progress Logs ────────────────────────────────────────────────────────────
export const getProgressLogs = () => req<ProgressLog[]>(`${BASE}/progress`);
export const upsertProgressLog = (data: Partial<ProgressLog>) => req<ProgressLog>(`${BASE}/progress`, { method: 'POST', body: JSON.stringify(data) });
export const deleteProgressLog = (id: string) => req<null>(`${BASE}/progress/${id}`, { method: 'DELETE' });

// ─── Thesis Milestones ────────────────────────────────────────────────────────
export const getThesisMilestones = () => req<ThesisMilestone[]>(`${BASE}/thesis`);
export const createThesisMilestone = (data: Partial<ThesisMilestone>) => req<ThesisMilestone>(`${BASE}/thesis`, { method: 'POST', body: JSON.stringify(data) });
export const updateThesisMilestone = (id: string, data: Partial<ThesisMilestone>) => req<ThesisMilestone>(`${BASE}/thesis/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteThesisMilestone = (id: string) => req<null>(`${BASE}/thesis/${id}`, { method: 'DELETE' });

// ─── Collab Tasks ─────────────────────────────────────────────────────────────
export const getCollabTasks = () => req<CollabTask[]>(`${BASE}/collab`);
export const createCollabTask = (data: Partial<CollabTask>) => req<CollabTask>(`${BASE}/collab`, { method: 'POST', body: JSON.stringify(data) });
export const updateCollabTask = (id: string, data: Partial<CollabTask>) => req<CollabTask>(`${BASE}/collab/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCollabTask = (id: string) => req<null>(`${BASE}/collab/${id}`, { method: 'DELETE' });

// ─── GPA Entries ──────────────────────────────────────────────────────────────
export const getGpaEntries = () => req<GpaEntry[]>(`${BASE}/gpa`);
export const createGpaEntry = (data: Partial<GpaEntry>) => req<GpaEntry>(`${BASE}/gpa`, { method: 'POST', body: JSON.stringify(data) });
export const updateGpaEntry = (id: string, data: Partial<GpaEntry>) => req<GpaEntry>(`${BASE}/gpa/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGpaEntry = (id: string) => req<null>(`${BASE}/gpa/${id}`, { method: 'DELETE' });
