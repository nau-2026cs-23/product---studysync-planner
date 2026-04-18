import { useEffect, useState } from 'react';
import { getProgressLogs, upsertProgressLog, deleteProgressLog, getThesisMilestones, createThesisMilestone, updateThesisMilestone, deleteThesisMilestone } from '@/lib/api';
import type { ProgressLog, ThesisMilestone } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, TrendingUp, BookOpen, X, BarChart3, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProgressView() {
  const { t } = useLanguage();

  const MOOD_LABELS = ['', t('exhausted'), t('tired'), t('okay'), t('good'), t('energized')];
  const MOOD_COLORS = ['', '#EF4444', '#F59E0B', '#6B7280', '#10B981', '#4F46E5'];

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
        if (!cancelled) toast.error(t('failedToLoadProgressData'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  async function handleLogSubmit() {
    if (!logForm.date) return toast.error(t('dateRequired'));
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
        toast.success(t('progressLogged'));
      }
    } catch { toast.error(t('failedToSaveLog')); }
    finally { setSaving(false); }
  }

  async function handleDeleteLog(id: string) {
    try {
      await deleteProgressLog(id);
      setLogs(prev => prev.filter(l => l.id !== id));
      toast.success(t('logDeleted'));
    } catch { toast.error(t('failedToDeleteLog')); }
  }

  async function handleMilestoneSubmit() {
    if (!milestoneForm.title || !milestoneForm.targetDate) return toast.error(t('titleAndTargetDateRequired'));
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
        toast.success(t('milestoneAdded'));
      }
    } catch { toast.error(t('failedToAddMilestone')); }
    finally { setSaving(false); }
  }

  async function updateMilestoneStatus(m: ThesisMilestone, status: string) {
    try {
      const res = await updateThesisMilestone(m.id, { ...m, status });
      if (res.success) setMilestones(prev => prev.map(x => x.id === m.id ? res.data : x));
    } catch { toast.error(t('failedToUpdateMilestone')); }
  }

  async function handleDeleteMilestone(id: string) {
    try {
      await deleteThesisMilestone(id);
      setMilestones(prev => prev.filter(m => m.id !== id));
      toast.success(t('milestoneDeleted'));
    } catch { toast.error(t('failedToDeleteMilestone')); }
  }

  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = logs.find(l => l.date === dateStr);
    return { date: dateStr, hours: log ? parseFloat(log.hoursStudied) : 0 };
  });
  const maxHours = Math.max(...heatmapDays.map(d => d.hours), 1);

  const weekLogs = logs.slice(0, 7);
  const totalStudied = weekLogs.reduce((a, l) => a + parseFloat(l.hoursStudied || '0'), 0);
  const totalPlanned = weekLogs.reduce((a, l) => a + parseFloat(l.hoursPlanned || '0'), 0);
  const adherence = totalPlanned > 0 ? Math.round((totalStudied / totalPlanned) * 100) : 0;

  const totalPages = milestones.reduce((a, m) => a + m.pagesTarget, 0);
  const donePages = milestones.reduce((a, m) => a + m.pagesDone, 0);
  const thesisPct = totalPages > 0 ? Math.round((donePages / totalPages) * 100) : 0;

  const statusColor = (s: string) => s === 'complete' ? '#10B981' : s === 'in_progress' ? '#F59E0B' : '#6B7280';
  const getStatusLabel = (s: string) => {
    switch(s) {
      case 'pending': return t('pending');
      case 'in_progress': return t('inProgress');
      case 'complete': return t('complete');
      default: return s;
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('progressTracking')}</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{t('progressDescription')}</p>
        </div>
        <button
          onClick={() => tab === 'logs' ? setShowLogForm(true) : setShowMilestoneForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: '#4F46E5', color: 'white' }}>
          <Plus size={16} /> {tab === 'logs' ? t('logProgress') : t('addMilestone')}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: t('hoursThisWeek'), value: totalStudied.toFixed(1) + 'h', color: '#4F46E5', sub: t('ofPlanned').replace('{hours}', totalPlanned.toFixed(1)) },
          { label: t('planAdherence'), value: adherence + '%', color: adherence >= 80 ? '#10B981' : adherence >= 50 ? '#F59E0B' : '#EF4444', sub: t('vsPlannedHours') },
          { label: t('thesisProgress'), value: thesisPct + '%', color: '#06B6D4', sub: `${donePages}/${totalPages} ${t('pagesTarget')}` },
          { label: t('milestonesDone'), value: milestones.filter(m => m.status === 'complete').length + '/' + milestones.length, color: '#10B981', sub: t('completed') },
        ].map(c => (
          <div key={c.label} className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: c.color }}>{c.value}</div>
            <p className="text-xs font-medium" style={{ color: '#111827' }}>{c.label}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 mb-6" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <BarChart3 size={18} color="#06B6D4" />
          {t('studyActivityHeatmap')}
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {[t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')].map(d => (
            <div key={d} className="text-center text-xs" style={{ color: '#6B7280' }}>{d}</div>
          ))}
          {heatmapDays.map(day => {
            const intensity = day.hours / maxHours;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.hours}h ${t('hStudied')}`}
                className="h-8 rounded-lg cursor-default transition-all"
                style={{
                  background: day.hours === 0 ? '#E5E7EB' : `rgba(6,182,212,${0.2 + intensity * 0.8})`,
                  border: isToday ? `2px solid #4F46E5` : '1px solid transparent',
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs" style={{ color: '#6B7280' }}>{t('less')}</span>
          {[0.1, 0.3, 0.5, 0.7, 1.0].map(op => (
            <div key={op} className="w-4 h-4 rounded" style={{ background: `rgba(6,182,212,${op})` }} />
          ))}
          <span className="text-xs" style={{ color: '#6B7280' }}>{t('more')}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['logs', 'thesis'] as const).map(tabKey => (
          <button key={tabKey} onClick={() => setTab(tabKey)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === tabKey ? 'rgba(79,70,229,0.1)' : 'transparent',
              color: tab === tabKey ? '#4F46E5' : '#6B7280',
              border: tab === tabKey ? '1px solid rgba(79,70,229,0.3)' : '1px solid #E5E7EB',
            }}>
            {tabKey === 'logs' ? t('progressLogs') : t('thesisMilestones')}
          </button>
        ))}
      </div>

      {tab === 'logs' && (
        <div className="rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp size={40} color="#E5E7EB" className="mx-auto mb-3" />
              <p style={{ color: '#6B7280' }}>{t('noProgressLogs')}</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
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
                          <span className="text-sm font-medium" style={{ color: '#111827' }}>{log.date}</span>
                          {log.mood && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${MOOD_COLORS[log.mood]}15`, color: MOOD_COLORS[log.mood] }}>
                              {MOOD_LABELS[log.mood]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: '#6B7280' }}>
                          <span style={{ color: onTrack ? '#10B981' : '#F59E0B' }}>{studied}h {t('hStudied')}</span>
                          <span>{t('ofPlannedShort').replace('{hours}', planned.toString())}</span>
                        </div>
                        {log.notes && <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{log.notes}</p>}
                      </div>
                      <button onClick={() => handleDeleteLog(log.id)} className="p-1 rounded-lg" style={{ color: '#6B7280' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: '#E5E7EB' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ background: onTrack ? '#10B981' : '#F59E0B', width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'thesis' && (
        <div className="space-y-3">
          {milestones.length === 0 ? (
            <div className="rounded-2xl text-center py-12" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
              <BookOpen size={40} color="#E5E7EB" className="mx-auto mb-3" />
              <p style={{ color: '#6B7280' }}>{t('noThesisMilestones')}</p>
            </div>
          ) : (
            milestones.map(m => {
              const pct = m.pagesTarget > 0 ? Math.round((m.pagesDone / m.pagesTarget) * 100) : 0;
              return (
                <div key={m.id} className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold" style={{ color: '#111827' }}>{m.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${statusColor(m.status)}15`, color: statusColor(m.status) }}>
                          {getStatusLabel(m.status)}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{t('targetDate')}: {m.targetDate} · {m.pagesDone}/{m.pagesTarget} {t('pagesTarget')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={m.status} onChange={e => updateMilestoneStatus(m, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg outline-none"
                        style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }}>
                        <option value="pending">{t('pending')}</option>
                        <option value="in_progress">{t('inProgress')}</option>
                        <option value="complete">{t('complete')}</option>
                      </select>
                      <button onClick={() => handleDeleteMilestone(m.id)} className="p-1 rounded-lg" style={{ color: '#6B7280' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-full h-2" style={{ background: '#E5E7EB' }}>
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

      {showLogForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>{t('logDailyProgress')}</h3>
              <button onClick={() => setShowLogForm(false)}><X size={20} color="#6B7280" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('date')} *</label>
                <input type="date" value={logForm.date} onChange={e => setLogForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('hoursStudied')}</label>
                  <input type="number" step="0.5" min="0" max="24" value={logForm.hoursStudied}
                    onChange={e => setLogForm(p => ({ ...p, hoursStudied: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('hoursPlanned')}</label>
                  <input type="number" step="0.5" min="0" max="24" value={logForm.hoursPlanned}
                    onChange={e => setLogForm(p => ({ ...p, hoursPlanned: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('mood')}: {MOOD_LABELS[logForm.mood]}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(m => (
                    <button key={m} onClick={() => setLogForm(p => ({ ...p, mood: m }))}
                      className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: logForm.mood === m ? `${MOOD_COLORS[m]}20` : '#FAFAFA',
                        border: logForm.mood === m ? `1px solid ${MOOD_COLORS[m]}` : '1px solid #E5E7EB',
                        color: logForm.mood === m ? MOOD_COLORS[m] : '#6B7280',
                      }}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('notes')}</label>
                <textarea value={logForm.notes} onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))}
                  rows={2} placeholder={t('whatDidYouStudyToday')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowLogForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>{t('cancel')}</button>
              <button onClick={handleLogSubmit} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white', opacity: saving ? 0.7 : 1 }}>
                {saving ? t('saving') : t('saveLog')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showMilestoneForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>{t('addThesisMilestone')}</h3>
              <button onClick={() => setShowMilestoneForm(false)}><X size={20} color="#6B7280" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('title')} *</label>
                <input value={milestoneForm.title} onChange={e => setMilestoneForm(p => ({ ...p, title: e.target.value }))}
                  placeholder={t('egChapterIntroduction')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('targetDate')} *</label>
                <input type="date" value={milestoneForm.targetDate} onChange={e => setMilestoneForm(p => ({ ...p, targetDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('pagesTarget')}</label>
                  <input type="number" min="0" value={milestoneForm.pagesTarget}
                    onChange={e => setMilestoneForm(p => ({ ...p, pagesTarget: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('pagesDone')}</label>
                  <input type="number" min="0" value={milestoneForm.pagesDone}
                    onChange={e => setMilestoneForm(p => ({ ...p, pagesDone: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>{t('status')}</label>
                <select value={milestoneForm.status} onChange={e => setMilestoneForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }}>
                  <option value="pending">{t('pending')}</option>
                  <option value="in_progress">{t('inProgress')}</option>
                  <option value="complete">{t('complete')}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowMilestoneForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>{t('cancel')}</button>
              <button onClick={handleMilestoneSubmit} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white', opacity: saving ? 0.7 : 1 }}>
                {saving ? t('saving') : t('addMilestone')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}