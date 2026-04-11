import { useEffect, useState } from 'react';
import { getProgressLogs, upsertProgressLog, deleteProgressLog, getThesisMilestones, createThesisMilestone, updateThesisMilestone, deleteThesisMilestone } from '@/lib/api';
import type { ProgressLog, ThesisMilestone } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, TrendingUp, BookOpen, X, BarChart3, Target } from 'lucide-react';

const MOOD_LABELS = ['', 'Exhausted', 'Tired', 'Okay', 'Good', 'Energized'];
const MOOD_COLORS = ['', '#EF4444', '#F59E0B', '#64748B', '#10B981', '#4F46E5'];

export default function ProgressView() {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [milestones, setMilestones] = useState<ThesisMilestone[]>([]);
  const [tab, setTab] = useState<'logs' | 'thesis'>('logs');
  const [showLogForm, setShowLogForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    hoursStudied: '2', hoursPlanned: '3', notes: '', mood: 3,
  });
  const [milestoneForm, setMilestoneForm] = useState({
    title: '', targetDate: '', pagesTarget: 20, pagesDone: 0, status: 'pending', order: 0,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [l, m] = await Promise.all([getProgressLogs(), getThesisMilestones()]);
        if (cancelled) return;
        if (l.success) setLogs(l.data);
        if (m.success) setMilestones(m.data);
      } catch {
        if (!cancelled) toast.error('Failed to load progress data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleLogSubmit() {
    if (!logForm.date) return toast.error('Date is required');
    setSaving(true);
    try {
      const res = await upsertProgressLog({
        date: logForm.date,
        hoursStudied: logForm.hoursStudied,
        hoursPlanned: logForm.hoursPlanned,
        notes: logForm.notes || null,
        mood: logForm.mood,
      });
      if (res.success) {
        setLogs(prev => {
          const idx = prev.findIndex(l => l.date === logForm.date);
          if (idx >= 0) { const next = [...prev]; next[idx] = res.data; return next; }
          return [res.data, ...prev];
        });
        setShowLogForm(false);
        toast.success('Progress logged!');
      }
    } catch { toast.error('Failed to save log'); }
    finally { setSaving(false); }
  }

  async function handleDeleteLog(id: string) {
    try {
      await deleteProgressLog(id);
      setLogs(prev => prev.filter(l => l.id !== id));
      toast.success('Log deleted');
    } catch { toast.error('Failed to delete log'); }
  }

  async function handleMilestoneSubmit() {
    if (!milestoneForm.title || !milestoneForm.targetDate) return toast.error('Title and target date required');
    setSaving(true);
    try {
      const res = await createThesisMilestone({
        title: milestoneForm.title,
        targetDate: milestoneForm.targetDate,
        pagesTarget: milestoneForm.pagesTarget,
        pagesDone: milestoneForm.pagesDone,
        status: milestoneForm.status,
        order: milestones.length,
      });
      if (res.success) {
        setMilestones(prev => [...prev, res.data]);
        setShowMilestoneForm(false);
        setMilestoneForm({ title: '', targetDate: '', pagesTarget: 20, pagesDone: 0, status: 'pending', order: 0 });
        toast.success('Milestone added!');
      }
    } catch { toast.error('Failed to add milestone'); }
    finally { setSaving(false); }
  }

  async function updateMilestoneStatus(m: ThesisMilestone, status: string) {
    try {
      const res = await updateThesisMilestone(m.id, { ...m, status });
      if (res.success) setMilestones(prev => prev.map(x => x.id === m.id ? res.data : x));
    } catch { toast.error('Failed to update milestone'); }
  }

  async function handleDeleteMilestone(id: string) {
    try {
      await deleteThesisMilestone(id);
      setMilestones(prev => prev.filter(m => m.id !== id));
      toast.success('Milestone deleted');
    } catch { toast.error('Failed to delete milestone'); }
  }

  // Heatmap data: last 28 days
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = logs.find(l => l.date === dateStr);
    return { date: dateStr, hours: log ? parseFloat(log.hoursStudied) : 0 };
  });
  const maxHours = Math.max(...heatmapDays.map(d => d.hours), 1);

  // Weekly summary
  const weekLogs = logs.slice(0, 7);
  const totalStudied = weekLogs.reduce((a, l) => a + parseFloat(l.hoursStudied || '0'), 0);
  const totalPlanned = weekLogs.reduce((a, l) => a + parseFloat(l.hoursPlanned || '0'), 0);
  const adherence = totalPlanned > 0 ? Math.round((totalStudied / totalPlanned) * 100) : 0;

  // Thesis stats
  const totalPages = milestones.reduce((a, m) => a + m.pagesTarget, 0);
  const donePages = milestones.reduce((a, m) => a + m.pagesDone, 0);
  const thesisPct = totalPages > 0 ? Math.round((donePages / totalPages) * 100) : 0;

  const statusColor = (s: string) => s === 'complete' ? '#10B981' : s === 'in_progress' ? '#F59E0B' : '#64748B';

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Progress Tracking</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Monitor your study habits and thesis milestones</p>
        </div>
        <button
          onClick={() => tab === 'logs' ? setShowLogForm(true) : setShowMilestoneForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: '#4F46E5', color: 'white' }}>
          <Plus size={16} /> {tab === 'logs' ? 'Log Progress' : 'Add Milestone'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Hours This Week', value: totalStudied.toFixed(1) + 'h', color: '#4F46E5', sub: `of ${totalPlanned.toFixed(1)}h planned` },
          { label: 'Plan Adherence', value: adherence + '%', color: adherence >= 80 ? '#10B981' : adherence >= 50 ? '#F59E0B' : '#EF4444', sub: 'vs planned hours' },
          { label: 'Thesis Progress', value: thesisPct + '%', color: '#06B6D4', sub: `${donePages}/${totalPages} pages` },
          { label: 'Milestones Done', value: milestones.filter(m => m.status === 'complete').length + '/' + milestones.length, color: '#10B981', sub: 'completed' },
        ].map(c => (
          <div key={c.label} className="rounded-2xl p-4" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: c.color }}>{c.value}</div>
            <p className="text-xs font-medium">{c.label}</p>
            <p className="text-xs" style={{ color: '#64748B' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={18} color="#06B6D4" />
          Study Activity Heatmap (Last 28 Days)
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="text-center text-xs" style={{ color: '#64748B' }}>{d}</div>
          ))}
          {heatmapDays.map(day => {
            const intensity = day.hours / maxHours;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.hours}h studied`}
                className="h-8 rounded-lg cursor-default transition-all"
                style={{
                  background: day.hours === 0 ? '#1E2D45' : `rgba(6,182,212,${0.2 + intensity * 0.8})`,
                  border: isToday ? '2px solid #4F46E5' : '1px solid transparent',
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs" style={{ color: '#64748B' }}>Less</span>
          {[0.1, 0.3, 0.5, 0.7, 1.0].map(op => (
            <div key={op} className="w-4 h-4 rounded" style={{ background: `rgba(6,182,212,${op})` }} />
          ))}
          <span className="text-xs" style={{ color: '#64748B' }}>More</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['logs', 'thesis'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === t ? 'rgba(79,70,229,0.2)' : 'transparent',
              color: tab === t ? '#4F46E5' : '#64748B',
              border: tab === t ? '1px solid rgba(79,70,229,0.3)' : '1px solid #1E2D45',
            }}>
            {t === 'logs' ? 'Progress Logs' : 'Thesis Milestones'}
          </button>
        ))}
      </div>

      {/* Progress Logs Tab */}
      {tab === 'logs' && (
        <div className="rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp size={40} color="#1E2D45" className="mx-auto mb-3" />
              <p style={{ color: '#64748B' }}>No progress logs yet. Start tracking your daily study hours!</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#1E2D45' }}>
              {logs.map(log => {
                const studied = parseFloat(log.hoursStudied || '0');
                const planned = parseFloat(log.hoursPlanned || '0');
                const pct = planned > 0 ? Math.min((studied / planned) * 100, 100) : 0;
                const onTrack = studied >= planned;
                return (
                  <div key={log.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-medium">{log.date}</span>
                          {log.mood && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${MOOD_COLORS[log.mood]}20`, color: MOOD_COLORS[log.mood] }}>
                              {MOOD_LABELS[log.mood]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: '#64748B' }}>
                          <span style={{ color: onTrack ? '#10B981' : '#F59E0B' }}>{studied}h studied</span>
                          <span>of {planned}h planned</span>
                        </div>
                        {log.notes && <p className="text-xs mt-1" style={{ color: '#64748B' }}>{log.notes}</p>}
                      </div>
                      <button onClick={() => handleDeleteLog(log.id)} className="p-1 rounded-lg" style={{ color: '#64748B' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: '#1E2D45' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ background: onTrack ? '#10B981' : '#F59E0B', width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Thesis Milestones Tab */}
      {tab === 'thesis' && (
        <div className="space-y-3">
          {milestones.length === 0 ? (
            <div className="rounded-2xl text-center py-12" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
              <BookOpen size={40} color="#1E2D45" className="mx-auto mb-3" />
              <p style={{ color: '#64748B' }}>No thesis milestones yet. Add your first chapter milestone!</p>
            </div>
          ) : (
            milestones.map(m => {
              const pct = m.pagesTarget > 0 ? Math.round((m.pagesDone / m.pagesTarget) * 100) : 0;
              return (
                <div key={m.id} className="rounded-2xl p-5" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{m.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${statusColor(m.status)}20`, color: statusColor(m.status) }}>
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#64748B' }}>Target: {m.targetDate} · {m.pagesDone}/{m.pagesTarget} pages</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={m.status} onChange={e => updateMilestoneStatus(m, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg outline-none"
                        style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="complete">Complete</option>
                      </select>
                      <button onClick={() => handleDeleteMilestone(m.id)} className="p-1 rounded-lg" style={{ color: '#64748B' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-full h-2" style={{ background: '#1E2D45' }}>
                      <div className="h-2 rounded-full transition-all" style={{ background: statusColor(m.status), width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: statusColor(m.status) }}>{pct}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Log Progress Modal */}
      {showLogForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Log Daily Progress</h3>
              <button onClick={() => setShowLogForm(false)}><X size={20} color="#64748B" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Date *</label>
                <input type="date" value={logForm.date} onChange={e => setLogForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Hours Studied</label>
                  <input type="number" step="0.5" min="0" max="24" value={logForm.hoursStudied}
                    onChange={e => setLogForm(p => ({ ...p, hoursStudied: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Hours Planned</label>
                  <input type="number" step="0.5" min="0" max="24" value={logForm.hoursPlanned}
                    onChange={e => setLogForm(p => ({ ...p, hoursPlanned: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Mood: {MOOD_LABELS[logForm.mood]}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(m => (
                    <button key={m} onClick={() => setLogForm(p => ({ ...p, mood: m }))}
                      className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: logForm.mood === m ? `${MOOD_COLORS[m]}30` : '#0B0F1A',
                        border: logForm.mood === m ? `1px solid ${MOOD_COLORS[m]}` : '1px solid #1E2D45',
                        color: logForm.mood === m ? MOOD_COLORS[m] : '#64748B',
                      }}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Notes (optional)</label>
                <textarea value={logForm.notes} onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))}
                  rows={2} placeholder="What did you study today?"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowLogForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}>Cancel</button>
              <button onClick={handleLogSubmit} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showMilestoneForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Add Thesis Milestone</h3>
              <button onClick={() => setShowMilestoneForm(false)}><X size={20} color="#64748B" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Title *</label>
                <input value={milestoneForm.title} onChange={e => setMilestoneForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Chapter 1 - Introduction"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Target Date *</label>
                <input type="date" value={milestoneForm.targetDate} onChange={e => setMilestoneForm(p => ({ ...p, targetDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Pages Target</label>
                  <input type="number" min="0" value={milestoneForm.pagesTarget}
                    onChange={e => setMilestoneForm(p => ({ ...p, pagesTarget: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Pages Done</label>
                  <input type="number" min="0" value={milestoneForm.pagesDone}
                    onChange={e => setMilestoneForm(p => ({ ...p, pagesDone: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Status</label>
                <select value={milestoneForm.status} onChange={e => setMilestoneForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowMilestoneForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}>Cancel</button>
              <button onClick={handleMilestoneSubmit} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Add Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
