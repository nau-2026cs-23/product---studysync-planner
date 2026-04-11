import { useEffect, useState } from 'react';
import { getSessions, createSession, updateSession, deleteSession, getCourses, getDeadlines } from '@/lib/api';
import type { StudySession, Course, Deadline } from '@/types';
import { toast } from 'sonner';
import {
  Plus, Trash2, CheckCircle2, Circle, Zap, ChevronLeft, ChevronRight,
  CalendarDays, X, Sparkles,
} from 'lucide-react';

const SESSION_COLORS: Record<string, string> = {
  study: '#4F46E5',
  review: '#06B6D4',
  exam: '#EF4444',
  group: '#10B981',
};

function getWeekDates(offset: number) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleView() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', date: new Date().toISOString().split('T')[0],
    startTime: '09:00', endTime: '11:00', durationHours: '2',
    type: 'study', courseId: '', notes: '', aiRecommended: false,
  });

  const weekDates = getWeekDates(weekOffset);
  const weekLabel = `${weekDates[0]} – ${weekDates[6]}`;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [s, c, d] = await Promise.all([getSessions(), getCourses(), getDeadlines()]);
        if (cancelled) return;
        if (s.success) setSessions(s.data);
        if (c.success) setCourses(c.data);
        if (d.success) setDeadlines(d.data);
      } catch {
        if (!cancelled) toast.error('Failed to load schedule');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleCreate() {
    if (!form.title || !form.date) return toast.error('Title and date are required');
    setSaving(true);
    try {
      const res = await createSession({
        title: form.title, date: form.date, startTime: form.startTime,
        endTime: form.endTime, durationHours: form.durationHours,
        type: form.type, courseId: form.courseId || null,
        notes: form.notes || null, aiRecommended: form.aiRecommended, completed: false,
      });
      if (res.success) {
        setSessions(prev => [...prev, res.data]);
        setShowForm(false);
        setForm({ title: '', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '11:00', durationHours: '2', type: 'study', courseId: '', notes: '', aiRecommended: false });
        toast.success('Session added!');
      }
    } catch { toast.error('Failed to create session'); }
    finally { setSaving(false); }
  }

  async function toggleComplete(s: StudySession) {
    try {
      const res = await updateSession(s.id, { ...s, completed: !s.completed });
      if (res.success) setSessions(prev => prev.map(x => x.id === s.id ? res.data : x));
    } catch { toast.error('Failed to update session'); }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success('Session deleted');
    } catch { toast.error('Failed to delete session'); }
  }

  function generateAISessions() {
    const aiSuggestions = [
      { title: 'AI: Deep Focus Study Block', startTime: '09:00', endTime: '11:00', durationHours: '2', type: 'study', aiRecommended: true },
      { title: 'AI: Review & Practice', startTime: '14:00', endTime: '15:30', durationHours: '1.5', type: 'review', aiRecommended: true },
      { title: 'AI: Exam Prep Sprint', startTime: '19:00', endTime: '21:00', durationHours: '2', type: 'study', aiRecommended: true },
    ];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tDate = tomorrow.toISOString().split('T')[0];
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setForm(prev => ({ ...prev, ...suggestion, date: tDate }));
    setShowForm(true);
    toast.success('AI recommendation loaded!', { description: 'Review and save the suggested session.' });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#4F46E5', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Plan and manage your study sessions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={generateAISessions}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ background: 'rgba(79,70,229,0.2)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.3)' }}>
            <Sparkles size={16} /> AI Suggest
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ background: '#4F46E5', color: 'white' }}>
            <Plus size={16} /> Add Session
          </button>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center justify-between mb-4 rounded-xl px-4 py-3" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
        <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#64748B' }}>
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold">{weekLabel}</p>
          <p className="text-xs" style={{ color: '#64748B' }}>Week {weekOffset === 0 ? '(Current)' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}</p>
        </div>
        <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#64748B' }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 mb-6">
        {weekDates.map((date, i) => {
          const daySessions = sessions.filter(s => s.date === date);
          const dayDeadlines = deadlines.filter(d => d.dueDate === date && !d.completed);
          const isToday = date === new Date().toISOString().split('T')[0];
          return (
            <div key={date} className="rounded-xl p-3 min-h-[120px]" style={{
              background: isToday ? 'rgba(79,70,229,0.1)' : '#131929',
              border: isToday ? '1px solid rgba(79,70,229,0.4)' : '1px solid #1E2D45',
            }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: isToday ? '#4F46E5' : '#64748B' }}>{DAY_LABELS[i]}</span>
                <span className="text-xs" style={{ color: '#64748B' }}>{date.slice(5)}</span>
              </div>
              <div className="space-y-1">
                {daySessions.map(s => (
                  <div key={s.id} className="rounded-lg px-2 py-1 text-xs" style={{
                    background: `${SESSION_COLORS[s.type] || '#4F46E5'}20`,
                    border: `1px solid ${SESSION_COLORS[s.type] || '#4F46E5'}40`,
                    color: SESSION_COLORS[s.type] || '#4F46E5',
                    textDecoration: s.completed ? 'line-through' : 'none',
                    opacity: s.completed ? 0.6 : 1,
                  }}>
                    <div className="font-medium truncate">{s.title}</div>
                    <div style={{ color: '#64748B' }}>{s.startTime} · {s.durationHours}h</div>
                  </div>
                ))}
                {dayDeadlines.map(d => (
                  <div key={d.id} className="rounded-lg px-2 py-1 text-xs" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
                    <div className="font-medium truncate">⚠ {d.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Session List */}
      <div className="rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
          <h2 className="font-semibold flex items-center gap-2">
            <CalendarDays size={18} color="#4F46E5" />
            All Sessions ({sessions.length})
          </h2>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays size={40} color="#1E2D45" className="mx-auto mb-3" />
            <p style={{ color: '#64748B' }}>No sessions yet. Add your first study session!</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1E2D45' }}>
            {sessions.map(s => {
              const color = SESSION_COLORS[s.type] || '#4F46E5';
              const course = courses.find(c => c.id === s.courseId);
              return (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                  <button onClick={() => toggleComplete(s)} className="flex-shrink-0">
                    {s.completed
                      ? <CheckCircle2 size={20} color="#10B981" />
                      : <Circle size={20} color="#64748B" />}
                  </button>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ textDecoration: s.completed ? 'line-through' : 'none', opacity: s.completed ? 0.6 : 1 }}>{s.title}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {s.date} · {s.startTime}–{s.endTime} · {s.durationHours}h
                      {course && ` · ${course.name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {s.aiRecommended && <Zap size={14} color="#4F46E5" />}
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>{s.type}</span>
                    <button onClick={() => handleDelete(s.id)} className="p-1 rounded-lg transition-colors" style={{ color: '#64748B' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Add Study Session</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#64748B" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Calculus III Study Block"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}>
                    <option value="study">Study</option>
                    <option value="review">Review</option>
                    <option value="exam">Exam</option>
                    <option value="group">Group</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Start</label>
                  <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>End</label>
                  <input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Hours</label>
                  <input type="number" step="0.5" min="0.5" max="12" value={form.durationHours}
                    onChange={e => setForm(p => ({ ...p, durationHours: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              </div>
              {courses.length > 0 && (
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Course (optional)</label>
                  <select value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}>
                    <option value="">No course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={2} placeholder="Optional notes..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.aiRecommended} onChange={e => setForm(p => ({ ...p, aiRecommended: e.target.checked }))}
                  className="rounded" />
                <span className="text-sm" style={{ color: '#64748B' }}>Mark as AI Recommended</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}>Cancel</button>
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#4F46E5', color: 'white', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Add Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
