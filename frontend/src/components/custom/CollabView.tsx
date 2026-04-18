import { useEffect, useState } from 'react';
import { getTeamTasks, createTeamTask, updateTeamTask, deleteTeamTask, getTeamMembers } from '@/lib/api';
import type { TeamTask, TeamMember } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, CheckCircle2, Circle, Users, X, BookOpen, Calendar, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#EF4444',
  high: '#F59E0B',
  medium: '#0EA5E9',
  low: '#10B981',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#6B7280',
  in_progress: '#F59E0B',
  review: '#0EA5E9',
  complete: '#10B981',
};

export default function CollabView() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', dueDate: '',
    assignedTo: '', status: 'pending',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [ta, m] = await Promise.all([getTeamTasks(), getTeamMembers()]);
        if (cancelled) return;
        if (ta.success) setTasks(ta.data);
        if (m.success) setMembers(m.data);
      } catch {
        if (!cancelled) toast.error(t('failedToLoadTeamTasks'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  async function handleCreate() {
    if (!form.title || !form.dueDate) return toast.error(t('titleAndDueDateRequired'));
    setSaving(true);
    try {
      const res = await createTeamTask({
        title: form.title,
        description: form.description || null,
        priority: form.priority,
        dueDate: form.dueDate,
        assignedTo: form.assignedTo || null,
        status: form.status,
      });
      if (res.success) {
        setTasks(prev => [...prev, res.data]);
        setShowForm(false);
        setForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '', status: 'pending' });
        toast.success(t('taskCreated'));
      }
    } catch { toast.error(t('failedToCreateTask')); }
    finally { setSaving(false); }
  }

  async function toggleTaskStatus(task: TeamTask) {
    const newStatus = task.status === 'complete' ? 'pending' : 'complete';
    try {
      const res = await updateTeamTask(task.id, { ...task, status: newStatus });
      if (res.success) setTasks(prev => prev.map(t => t.id === task.id ? res.data : t));
    } catch { toast.error(t('failedToUpdateTask')); }
  }

  async function updateTaskStatus(task: TeamTask, status: string) {
    try {
      const res = await updateTeamTask(task.id, { ...task, status });
      if (res.success) setTasks(prev => prev.map(t => t.id === task.id ? res.data : t));
    } catch { toast.error(t('failedToUpdateTask')); }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTeamTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success(t('taskDeleted'));
    } catch { toast.error(t('failedToDeleteTask')); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#4F46E5', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'complete').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('teamTasks')}</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{t('teamTasksDescription')}</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: '#4F46E5', color: 'white' }}>
          <Plus size={16} /> {t('addTask')}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: t('totalTasks'), value: tasks.length, color: '#4F46E5' },
          { label: t('inProgress'), value: inProgressTasks, color: '#F59E0B' },
          { label: t('completed'), value: completedTasks, color: '#10B981' },
        ].map(c => (
          <div key={c.label} className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: c.color }}>{c.value}</div>
            <p className="text-xs font-medium" style={{ color: '#111827' }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
          <h2 className="font-semibold flex items-center gap-2">
            <Users size={18} color="#4F46E5" />
            {t('allTasks')} ({tasks.length})
          </h2>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} color="#E5E7EB" className="mx-auto mb-3" />
            <p style={{ color: '#6B7280' }}>{t('noTasksYet')}</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
            {tasks.map(task => {
              const assignedMember = members.find(m => m.id === task.assignedTo);
              return (
                <div key={task.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <button onClick={() => toggleTaskStatus(task)} className="flex-shrink-0 mt-0.5">
                    {task.status === 'complete'
                      ? <CheckCircle2 size={20} color="#10B981" />
                      : <Circle size={20} color="#6B7280" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ textDecoration: task.status === 'complete' ? 'line-through' : 'none', opacity: task.status === 'complete' ? 0.6 : 1 }}>{task.title}</p>
                    {task.description && <p className="text-xs mt-0.5 truncate" style={{ color: '#6B7280' }}>{task.description}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority] }}>
                        {task.priority}
                      </span>
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        <Calendar size={10} className="inline mr-1" />{task.dueDate}
                      </span>
                      {assignedMember && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5' }}>
                          <UserPlus size={10} className="inline mr-1" />{assignedMember.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select value={task.status} onChange={e => updateTaskStatus(task, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg outline-none"
                      style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: STATUS_COLORS[task.status] }}>
                      <option value="pending">{t('pending')}</option>
                      <option value="in_progress">{t('inProgress')}</option>
                      <option value="review">{t('review')}</option>
                      <option value="complete">{t('complete')}</option>
                    </select>
                    <button onClick={() => handleDelete(task.id)} className="p-1 rounded-lg" style={{ color: '#6B7280' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>{t('addTeamTask')}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#6B7280" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('title')} *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder={t('taskTitlePlaceholder')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('description')}</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder={t('taskDescriptionPlaceholder')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('priority')}</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }}>
                    <option value="low">{t('low')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                    <option value="urgent">{t('urgent')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('dueDate')} *</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('assignTo')}</label>
                <select value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }}>
                  <option value="">{t('unassigned')}</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('status')}</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }}>
                  <option value="pending">{t('pending')}</option>
                  <option value="in_progress">{t('inProgress')}</option>
                  <option value="review">{t('review')}</option>
                  <option value="complete">{t('complete')}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>{t('cancel')}</button>
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white', opacity: saving ? 0.7 : 1 }}>
                {saving ? t('saving') : t('addTask')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}