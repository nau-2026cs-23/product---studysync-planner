import { Router, Request, Response } from 'express';
import {
  coursesRepo, studySessionsRepo, deadlinesRepo, progressLogsRepo,
  thesisMilestonesRepo, collabTasksRepo, gpaEntriesRepo, notesRepo, draftsRepo,
} from '../repositories/studyPlanner';
import {
  insertCourseSchema, updateCourseSchema,
  insertStudySessionSchema, updateStudySessionSchema,
  insertDeadlineSchema, updateDeadlineSchema,
  insertProgressLogSchema,
  insertThesisMilestoneSchema, updateThesisMilestoneSchema,
  insertCollabTaskSchema, updateCollabTaskSchema,
  insertGpaEntrySchema, updateGpaEntrySchema,
  insertNoteSchema, updateNoteSchema,
  insertDraftSchema, updateDraftSchema,
} from '../db/schema';

const router = Router();

// ─── Courses ──────────────────────────────────────────────────────────────────
router.get('/courses', async (_req: Request, res: Response) => {
  try {
    const data = await coursesRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/courses', async (req: Request, res: Response) => {
  try {
    const parsed = insertCourseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await coursesRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateCourseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await coursesRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await coursesRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── Study Sessions ───────────────────────────────────────────────────────────
router.get('/sessions', async (_req: Request, res: Response) => {
  try {
    const data = await studySessionsRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const parsed = insertStudySessionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await studySessionsRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateStudySessionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await studySessionsRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await studySessionsRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── Deadlines ────────────────────────────────────────────────────────────────
router.get('/deadlines', async (_req: Request, res: Response) => {
  try {
    const data = await deadlinesRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/deadlines', async (req: Request, res: Response) => {
  try {
    const parsed = insertDeadlineSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await deadlinesRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/deadlines/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateDeadlineSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await deadlinesRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/deadlines/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await deadlinesRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── Progress Logs ────────────────────────────────────────────────────────────
router.get('/progress', async (_req: Request, res: Response) => {
  try {
    const data = await progressLogsRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/progress', async (req: Request, res: Response) => {
  try {
    const parsed = insertProgressLogSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await progressLogsRepo.upsert(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/progress/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await progressLogsRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── Thesis Milestones ────────────────────────────────────────────────────────
router.get('/thesis', async (_req: Request, res: Response) => {
  try {
    const data = await thesisMilestonesRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/thesis', async (req: Request, res: Response) => {
  try {
    const parsed = insertThesisMilestoneSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await thesisMilestonesRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/thesis/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateThesisMilestoneSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await thesisMilestonesRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/thesis/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await thesisMilestonesRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── Collab Tasks ─────────────────────────────────────────────────────────────
router.get('/collab', async (_req: Request, res: Response) => {
  try {
    const data = await collabTasksRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/collab', async (req: Request, res: Response) => {
  try {
    const parsed = insertCollabTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await collabTasksRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/collab/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateCollabTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await collabTasksRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/collab/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await collabTasksRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── GPA Entries ──────────────────────────────────────────────────────────────
router.get('/gpa', async (_req: Request, res: Response) => {
  try {
    const data = await gpaEntriesRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/gpa', async (req: Request, res: Response) => {
  try {
    const parsed = insertGpaEntrySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await gpaEntriesRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/gpa/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateGpaEntrySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await gpaEntriesRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/gpa/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await gpaEntriesRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── Notes ───────────────────────────────────────────────────────────────────
router.get('/notes', async (_req: Request, res: Response) => {
  try {
    const data = await notesRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/notes', async (req: Request, res: Response) => {
  try {
    const parsed = insertNoteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await notesRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/notes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateNoteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await notesRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/notes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await notesRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

// ─── Drafts ──────────────────────────────────────────────────────────────────
router.get('/drafts', async (_req: Request, res: Response) => {
  try {
    const data = await draftsRepo.getAll();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.post('/drafts', async (req: Request, res: Response) => {
  try {
    const parsed = insertDraftSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await draftsRepo.create(parsed.data);
    res.status(201).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.put('/drafts/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = updateDraftSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
    const data = await draftsRepo.update(id, parsed.data as any);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});

router.delete('/drafts/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await draftsRepo.delete(id);
    res.json({ success: true, data: null });
  } catch (e) { res.status(500).json({ success: false, message: String(e) }); }
});



export default router;
