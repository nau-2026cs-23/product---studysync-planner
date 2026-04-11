import { useEffect, useState } from 'react';
import { getGpaEntries, createGpaEntry, updateGpaEntry, deleteGpaEntry } from '@/lib/api';
import type { GpaEntry } from '@/types';
import { toast } from 'sonner';
import { Plus, Trash2, GraduationCap, X, TrendingUp, Edit2, Check } from 'lucide-react';

function gradeToPoints(grade: number): number {
  if (grade >= 93) return 4.0;
  if (grade >= 90) return 3.7;
  if (grade >= 87) return 3.3;
  if (grade >= 83) return 3.0;
  if (grade >= 80) return 2.7;
  if (grade >= 77) return 2.3;
  if (grade >= 73) return 2.0;
  if (grade >= 70) return 1.7;
  if (grade >= 67) return 1.3;
  if (grade >= 63) return 1.0;
  if (grade >= 60) return 0.7;
  return 0.0;
}

function gpaColor(gpa: number): string {
  if (gpa >= 3.5) return '#10B981';
  if (gpa >= 3.0) return '#06B6D4';
  if (gpa >= 2.5) return '#F59E0B';
  return '#EF4444';
}

function letterGrade(grade: number): string {
  if (grade >= 93) return 'A';
  if (grade >= 90) return 'A-';
  if (grade >= 87) return 'B+';
  if (grade >= 83) return 'B';
  if (grade >= 80) return 'B-';
  if (grade >= 77) return 'C+';
  if (grade >= 73) return 'C';
  if (grade >= 70) return 'C-';
  return 'D';
}

export default function GpaView() {
  const [entries, setEntries] = useState<GpaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editGrade, setEditGrade] = useState('');
  const [editHours, setEditHours] = useState('');
  const [form, setForm] = useState({
    courseName: '', credits: 3, currentGrade: '85', targetGrade: '90',
    studyHoursPerWeek: '5', semester: 'Spring 2026',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getGpaEntries();
        if (cancelled) return;
        if (res.success) setEntries(res.data);
      } catch {
        if (!cancelled) toast.error('Failed to load GPA data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleCreate() {
    if (!form.courseName) return toast.error('Course name is required');
    setSaving(true);
    try {
      const res = await createGpaEntry({
        courseName: form.courseName,
        credits: form.credits,
        currentGrade: form.currentGrade,
        targetGrade: form.targetGrade,
        studyHoursPerWeek: form.studyHoursPerWeek,
        semester: form.semester,
      });
      if (res.success) {
        setEntries(prev => [...prev, res.data]);
        setShowForm(false);
        setForm({ courseName: '', credits: 3, currentGrade: '85', targetGrade: '90', studyHoursPerWeek: '5', semester: 'Spring 2026' });
        toast.success('Course added!');
      }
    } catch { toast.error('Failed to add course'); }
    finally { setSaving(false); }
  }

  async function handleUpdateGrade(entry: GpaEntry) {
    try {
      const res = await updateGpaEntry(entry.id, { ...entry, currentGrade: editGrade, studyHoursPerWeek: editHours });
      if (res.success) {
        setEntries(prev => prev.map(e => e.id === entry.id ? res.data : e));
        setEditingId(null);
        toast.success('Updated!');
      }
    } catch { toast.error('Failed to update'); }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGpaEntry(id);
      setEntries(prev => prev.filter(e => e.id !== id));
      toast.success('Course removed');
    } catch { toast.error('Failed to delete'); }
  }

  // GPA Calculations
  const currentGpa = entries.length > 0
    ? entries.reduce((acc, e) => acc + gradeToPoints(parseFloat(e.currentGrade)) * e.credits, 0) /
      entries.reduce((acc, e) => acc + e.credits, 0)
    : null;

  const targetGpa = entries.length > 0
    ? entries.reduce((acc, e) => acc + gradeToPoints(parseFloat(e.targetGrade)) * e.credits, 0) /
      entries.reduce((acc, e) => acc + e.credits, 0)
    : null;

  const totalCredits = entries.reduce((acc, e) => acc + e.credits, 0);
  const totalStudyHours = entries.reduce((acc, e) => acc + parseFloat(e.studyHoursPerWeek || '0'), 0);

  // Study hours impact: each extra hour/week adds ~0.05 GPA points (simplified model)
  const predictedGpa = currentGpa !== null
    ? Math.min(4.0, currentGpa + (totalStudyHours / entries.length - 5) * 0.02)
    : null;

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">GPA Predictor</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Forecast your semester GPA based on study inputs</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: '#4F46E5', color: 'white' }}>
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* GPA Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {
          [
            {
              label: 'Current GPA',
              value: currentGpa !== null ? currentGpa.toFixed(2) : 'N/A',
              color: currentGpa !== null ? gpaColor(currentGpa) : '#64748B',
              sub: 'Based on current grades',
            },
            {
              label: 'Predicted GPA',
              value: predictedGpa !== null ? predictedGpa.toFixed(2) : 'N/A',
              color: predictedGpa !== null ? gpaColor(predictedGpa) : '#64748B',
              sub: 'With study hours factored in',
            },
            {
              label: 'Target GPA',
              value: targetGpa !== null ? targetGpa.toFixed(2) : 'N/A',
              color: '#4F46E5',
              sub: 'Your goal this semester',
            },
            {
              label: 'Total Credits',
              value: totalCredits.toString(),
              color: '#06B6D4',
              sub: `${entries.length} courses enrolled`,
            },
          ].map(c => (
            <div key={c.label} className="rounded-2xl p-4" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
              <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: c.color }}>{c.value}</div>
              <p className="text-xs font-medium">{c.label}</p>
              <p className="text-xs" style={{ color: '#64748B' }}>{c.sub}</p>
            </div>
          ))
        }
      </div>

      {/* GPA Gauge */}
      {currentGpa !== null && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} color="#10B981" />
            GPA Forecast Visualization
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Current GPA', value: currentGpa, color: gpaColor(currentGpa) },
              { label: 'Predicted GPA', value: predictedGpa || currentGpa, color: '#4F46E5' },
              { label: 'Target GPA', value: targetGpa || currentGpa, color: '#06B6D4' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: '#64748B' }}>{item.label}</span>
                  <span className="font-bold" style={{ color: item.color }}>{item.value.toFixed(2)} / 4.0</span>
                </div>
                <div className="w-full rounded-full h-3" style={{ background: '#1E2D45' }}>
                  <div className="h-3 rounded-full transition-all duration-500" style={{ background: item.color, width: `${(item.value / 4.0) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
            <p className="text-xs" style={{ color: '#64748B' }}>
              <span style={{ color: '#4F46E5' }}>AI Insight: </span>
              {predictedGpa !== null && currentGpa !== null && predictedGpa > currentGpa
                ? `Your study hours are projected to boost your GPA by +${(predictedGpa - currentGpa).toFixed(2)} points. Keep it up!`
                : `Increasing your weekly study hours could improve your predicted GPA. Aim for ${Math.ceil(totalStudyHours / Math.max(entries.length, 1) + 2)}h/week per course.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Course Table */}
      <div className="rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
          <h2 className="font-semibold flex items-center gap-2">
            <GraduationCap size={18} color="#4F46E5" />
            Enrolled Courses ({entries.length})
          </h2>
        </div>
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap size={40} color="#1E2D45" className="mx-auto mb-3" />
            <p style={{ color: '#64748B' }}>No courses added yet. Add your courses to predict your GPA!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #1E2D45' }}>
                  {['Course', 'Credits', 'Current Grade', 'Study Hrs/Wk', 'Target', 'GPA Points', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => {
                  const grade = parseFloat(entry.currentGrade);
                  const points = gradeToPoints(grade);
                  const isEditing = editingId === entry.id;
                  return (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1E2D45' }}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{entry.courseName}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{entry.semester}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">{entry.credits}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input type="number" min="0" max="100" value={editGrade}
                            onChange={e => setEditGrade(e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg text-sm outline-none"
                            style={{ background: '#0B0F1A', border: '1px solid #4F46E5', color: '#F1F5F9' }} />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold" style={{ color: gpaColor(points) }}>{entry.currentGrade}%</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${gpaColor(points)}20`, color: gpaColor(points) }}>{letterGrade(grade)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input type="number" min="0" max="40" step="0.5" value={editHours}
                            onChange={e => setEditHours(e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg text-sm outline-none"
                            style={{ background: '#0B0F1A', border: '1px solid #4F46E5', color: '#F1F5F9' }} />
                        ) : (
                          <span className="text-sm">{entry.studyHoursPerWeek}h</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#4F46E5' }}>{entry.targetGrade}%</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: gpaColor(points) }}>{points.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <button onClick={() => handleUpdateGrade(entry)} className="p-1.5 rounded-lg" style={{ color: '#10B981' }}>
                              <Check size={14} />
                            </button>
                          ) : (
                            <button onClick={() => { setEditingId(entry.id); setEditGrade(entry.currentGrade); setEditHours(entry.studyHoursPerWeek); }}
                              className="p-1.5 rounded-lg" style={{ color: '#64748B' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#4F46E5')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                              <Edit2 size={14} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg" style={{ color: '#64748B' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Add Course</h3>
              <button onClick={() => setShowForm(false)}><X size={20} color="#64748B" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Course Name *</label>
                <input value={form.courseName} onChange={e => setForm(p => ({ ...p, courseName: e.target.value }))}
                  placeholder="e.g. Calculus III"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Credits</label>
                  <input type="number" min="1" max="6" value={form.credits}
                    onChange={e => setForm(p => ({ ...p, credits: parseInt(e.target.value) || 3 }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Semester</label>
                  <input value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                    placeholder="Spring 2026"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Current Grade (%)</label>
                  <input type="number" min="0" max="100" value={form.currentGrade}
                    onChange={e => setForm(p => ({ ...p, currentGrade: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Target Grade (%)</label>
                  <input type="number" min="0" max="100" value={form.targetGrade}
                    onChange={e => setForm(p => ({ ...p, targetGrade: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Study Hours / Week</label>
                <input type="number" min="0" max="40" step="0.5" value={form.studyHoursPerWeek}
                  onChange={e => setForm(p => ({ ...p, studyHoursPerWeek: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
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
                {saving ? 'Adding...' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
