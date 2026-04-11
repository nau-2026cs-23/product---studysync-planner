import { useEffect, useState } from 'react';
import { getCollabTasks, createCollabTask, updateCollabTask, deleteCollabTask } from '@/lib/api';
import type { CollabTask } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, Users, X, AtSign, CheckCircle2, Clock, Circle } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  todo: { label: 'To Do', color: '#64748B', icon: Circle },
  in_progress: { label: 'In Progress', color: '#F59E0B', icon: Clock },
  done: { label: 'Done', color: '#10B981', icon: CheckCircle2 },
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#10B981', medium: '#0EA5E9', high: '#F59E0B', urgent: '#EF4444',
};

function getInitials(name: string) {
  return name.replace('@', '').slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function CollabView() {
  const [tasks, setTasks] = useState<CollabTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterProject, setFilterProject] = useState<string>('all');
  const [form, setForm] = useState({
    projectName: '', title: '', assignedTo: '@me', assignedBy: '@me',
    status: 'todo', priority: 'medium', dueDate: '', description: '', mentions: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getCollabTasks();
        if (cancelled) return;
        if (res.success) setTasks(res.data);
      } catch {
        if (!cancelled) toast.error('Failed to load tasks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleCreate() {
    if (!form.projectName || !form.title) return toast.error('Project name and title are required');
    setSaving(true);
    try {
      const res = await createCollabTask({
        projectName: form.projectName, title: form.title,
        assignedTo: form.assignedTo, assignedBy: form.assignedBy,
        status: form.status, priority: form.priority,
        dueDate: form.dueDate || null, description: form.description || null,
        mentions: form.mentions || null,
      });
      if (res.success) {
        setTasks(prev => [res.data, ...prev]);
        setShowForm(false);
        setForm({ projectName: '', title: '', assignedTo: '@me', assignedBy: '@me', status: 'todo', priority: 'medium', dueDate: '', description: '', mentions: '' });
        toast.success('Task created!');
      }
    } catch { toast.error('Failed to create task'); }
    finally { setSaving(false); }
  }

  async function updateStatus(task: CollabTask, status: string) {
    try {
      const res = await updateCollabTask(task.id, { ...task, status });
      if (res.success) setTasks(prev => prev.map(t => t.id === task.id ? res.data : t));
    } catch { toast.error('Failed to update task'); }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCollabTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  }

  const projects = ['all', ...Array.from(new Set(tasks.map(t => t.projectName)))];
  const filtered = filterProject === 'all' ? tasks : tasks.filter(t => t.projectName === filterProject);

  const grouped: Record<string, CollabTask[]> = {
    todo: filtered.filter(t => t.status === 'todo'),
    in_progress: filtered.filter(t => t.status === 'in_progress'),
    done: filtered.filter(t => t.status === 'done'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#4F46E5', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Collaboration Hub</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Shared task boards for group projects with @mention notifications</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: '#4F46E5', color: 'white' }}>
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="rounded-2xl p-4 text-center" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
              <Icon size={20} color={cfg.color} className="mx-auto mb-2" />
              <div className="text-2xl font-bold" style={{ color: cfg.color }}>{grouped[key]?.length || 0}</div>
              <p className="text-xs" style={{ color: '#64748B' }}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Project Filter */}
      {projects.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {projects.map(p => (
            <button key={p} onClick={() => setFilterProject(p)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filterProject === p ? 'rgba(79,70,229,0.2)' : 'transparent',
                color: filterProject === p ? '#4F46E5' : '#64748B',
                border: filterProject === p ? '1px solid rgba(79,70,229,0.3)' : '1px solid #1E2D45',
              }}>
              {p === 'all' ? 'All Projects' : p}
            </button>
          ))}
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const Icon = cfg.icon;
          const columnTasks = grouped[status] || [];
          return (
            <div key={status} className="rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #1E2D45' }}>
                <Icon size={16} color={cfg.color} />
                <span className="text-sm font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: `${cfg.color}20`, color: cfg.color }}>{columnTasks.length}</span>
              </div>
              <div className="p-3 space-y-3 min-h-[200px]">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs" style={{ color: '#64748B' }}>No tasks here</p>
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <div key={task.id} className="rounded-xl p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className="text-xs" style={{ color: '#64748B' }}>{task.projectName}</p>
                        </div>
                        <button onClick={() => handleDelete(task.id)} className="p-1 rounded flex-shrink-0" style={{ color: '#64748B' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: '#64748B' }}>{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: getAvatarColor(task.assignedTo), fontSize: '9px' }}>
                          {getInitials(task.assignedTo)}
                        </div>
                        <span className="text-xs" style={{ color: '#0EA5E9' }}>{task.assignedTo}</span>
                        {task.dueDate && <span className="text-xs ml-auto" style={{ color: '#64748B' }}>{task.dueDate}</span>}
                      </div>
                      {task.mentions && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {task.mentions.split(',').map(m => m.trim()).filter(Boolean).map(mention => (
                            <span key={mention} className="text-xs flex items-center gap-0.5" style={{ color: '#0EA5E9' }}>
                              <AtSign size={10} />{mention.replace('@', '')}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${PRIORITY_COLORS[task.priority]}20`, color: PRIORITY_COLORS[task.priority] }}>
                          {task.priority}
                        </span>
                        <select value={task.status} onChange={e => updateStatus(task, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg outline-none"
                          style={{ background: '#131929', border: '1px solid #1E2D45', color: '#F1F5F9' }}>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      {tasks.length > 0 && (
        <div className="mt-6 rounded-2xl p-5" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Users size={18} color="#0EA5E9" />
            Recent Activity
          </h2>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: getAvatarColor(task.assignedBy), fontSize: '9px' }}>
                  {getInitials(task.assignedBy)}
                </div>
                <p className="text-sm flex-1 min-w-0 truncate">
                  <span style={{ color: '#0EA5E9' }}>{task.assignedBy}</span>
                  {' '}{task.status === 'done' ? 'completed' : task.status === 'in_progress' ? 'is working on' : 'created'}{' '}
                  <span className="font-medium">{task.title}</span>
                </p>
                <span className="text-xs flex-shrink-0" style={{ color: STATUS_CONFIG[task.status]?.color || '#64748B' }}>
                  {STATUS_CONFIG[task.status]?.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Create Task</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#64748B" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Project Name *</label>
                <input value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))}
                  placeholder="e.g. Research Paper Group"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Task Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Write Literature Review"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Assigned To</label>
                  <input value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
                    placeholder="@username"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Assigned By</label>
                  <input value={form.assignedBy} onChange={e => setForm(p => ({ ...p, assignedBy: e.target.value }))}
                    placeholder="@username"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>@Mentions (comma separated)</label>
                <input value={form.mentions} onChange={e => setForm(p => ({ ...p, mentions: e.target.value }))}
                  placeholder="@alex, @sam, @maya"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder="Task details..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}>Cancel</button>
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
