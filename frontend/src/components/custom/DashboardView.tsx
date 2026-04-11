import { useEffect, useState } from 'react';
import { getDeadlines, getSessions, getProgressLogs, getGpaEntries } from '@/lib/api';
import type { Deadline, StudySession, ProgressLog, GpaEntry, AppView } from '@/types';
import { toast } from 'sonner';
import AISummaryComponent from '@/components/ai/AISummaryComponent';
import {
  AlertCircle, CheckCircle2, Clock, TrendingUp, BookOpen,
  CalendarDays, BarChart3, Zap, ChevronRight, Target,
} from 'lucide-react';

interface Props {
  onNavigate: (view: AppView) => void;
}

function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function priorityColor(p: string) {
  if (p === 'urgent') return '#EF4444';
  if (p === 'high') return '#F59E0B';
  if (p === 'medium') return '#0EA5E9';
  return '#10B981';
}

export default function DashboardView({ onNavigate }: Props) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [gpaEntries, setGpaEntries] = useState<GpaEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [d, s, l, g] = await Promise.all([
          getDeadlines(), getSessions(), getProgressLogs(), getGpaEntries(),
        ]);
        if (cancelled) return;
        if (d.success) setDeadlines(d.data);
        if (s.success) setSessions(s.data);
        if (l.success) setLogs(l.data);
        if (g.success) setGpaEntries(g.data);
      } catch {
        if (!cancelled) toast.error('Failed to load dashboard data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcomingDeadlines = deadlines.filter(d => !d.completed && daysUntil(d.dueDate) >= 0).slice(0, 5);
  const todaySessions = sessions.filter(s => s.date === today);
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalSessions = sessions.length;

  const weekLogs = logs.slice(0, 7);
  const totalStudied = weekLogs.reduce((acc, l) => acc + parseFloat(l.hoursStudied || '0'), 0);
  const totalPlanned = weekLogs.reduce((acc, l) => acc + parseFloat(l.hoursPlanned || '0'), 0);

  // GPA calculation
  const predictedGpa = gpaEntries.length > 0
    ? gpaEntries.reduce((acc, e) => {
        const grade = parseFloat(e.currentGrade);
        const credits = e.credits;
        const gradePoints = grade >= 93 ? 4.0 : grade >= 90 ? 3.7 : grade >= 87 ? 3.3 : grade >= 83 ? 3.0 : grade >= 80 ? 2.7 : grade >= 77 ? 2.3 : grade >= 73 ? 2.0 : grade >= 70 ? 1.7 : 1.0;
        return acc + gradePoints * credits;
      }, 0) / gpaEntries.reduce((acc, e) => acc + e.credits, 0)
    : null;

  const statCards = [
    {
      label: '学习时间（周）',
      value: totalStudied.toFixed(1) + '小时',
      sub: totalPlanned > 0 ? `计划 ${totalPlanned.toFixed(1)}小时` : '未设置计划',
      icon: Clock,
      color: '#4F46E5',
      bg: 'rgba(79,70,229,0.15)',
    },
    {
      label: '完成的学习时段',
      value: `${completedSessions}/${totalSessions}`,
      sub: totalSessions > 0 ? `完成率 ${Math.round((completedSessions / totalSessions) * 100)}%` : '暂无学习时段',
      icon: CheckCircle2,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.15)',
    },
    {
      label: '即将到来的截止日期',
      value: upcomingDeadlines.length.toString(),
      sub: upcomingDeadlines.length > 0 ? `下一个: ${upcomingDeadlines[0]?.title?.slice(0, 20)}...` : '一切顺利！',
      icon: AlertCircle,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.15)',
    },
    {
      label: '预测 GPA',
      value: predictedGpa !== null ? predictedGpa.toFixed(2) : 'N/A',
      sub: gpaEntries.length > 0 ? `基于 ${gpaEntries.length} 门课程` : '添加课程以预测',
      icon: TrendingUp,
      color: '#06B6D4',
      bg: 'rgba(6,182,212,0.15)',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: '#4F46E5', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#64748B' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">仪表板</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>欢迎回来 — 这是您今天的学术概览。</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl p-4 sm:p-5" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon size={18} color={card.color} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: card.color }}>{card.value}</div>
              <p className="text-xs font-medium mb-0.5">{card.label}</p>
              <p className="text-xs" style={{ color: '#64748B' }}>{card.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <CalendarDays size={18} color="#4F46E5" />
              今日学习时段
            </h2>
            <button onClick={() => onNavigate('schedule')}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: '#4F46E5' }}>
              查看全部 <ChevronRight size={14} />
            </button>
          </div>
          {todaySessions.length === 0 ? (
            <div className="text-center py-10">
              <CalendarDays size={32} color="#1E2D45" className="mx-auto mb-3" />
              <p className="text-sm" style={{ color: '#64748B' }}>今天没有安排学习时段</p>
              <button onClick={() => onNavigate('schedule')}
                className="mt-3 text-xs px-4 py-2 rounded-lg transition-colors"
                style={{ background: 'rgba(79,70,229,0.2)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.3)' }}>
                添加学习时段
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySessions.map(s => (
                <div key={s.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.completed ? '#10B981' : '#4F46E5' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{s.startTime} – {s.endTime} · {s.durationHours}小时</p>
                  </div>
                  {s.aiRecommended && (
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(79,70,229,0.2)', color: '#4F46E5' }}>
                      <Zap size={10} className="inline mr-1" />AI
                    </span>
                  )}
                  <span className="text-xs flex-shrink-0" style={{ color: s.completed ? '#10B981' : '#64748B' }}>
                    {s.completed ? '已完成' : '待完成'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-2xl p-5" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Target size={18} color="#F59E0B" />
              即将到来的截止日期
            </h2>
            <button onClick={() => onNavigate('schedule')}
              className="text-xs flex items-center gap-1"
              style={{ color: '#F59E0B' }}>
              全部 <ChevronRight size={14} />
            </button>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 size={32} color="#10B981" className="mx-auto mb-3" />
              <p className="text-sm" style={{ color: '#64748B' }}>没有即将到来的截止日期！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map(d => {
                const days = daysUntil(d.dueDate);
                const urgency = days <= 2 ? '#EF4444' : days <= 7 ? '#F59E0B' : '#10B981';
                return (
                  <div key={d.id} className="rounded-xl p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{d.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{d.type} · {d.dueDate}</p>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color: urgency }}>
                        {days === 0 ? '今天' : days === 1 ? '明天' : `${days}天`}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${priorityColor(d.priority)}20`, color: priorityColor(d.priority) }}>
                        {d.priority === 'urgent' ? '紧急' : d.priority === 'high' ? '高' : d.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Progress Bar Chart */}
      <div className="mt-6 rounded-2xl p-5" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <BarChart3 size={18} color="#06B6D4" />
            每周学习时间
          </h2>
          <button onClick={() => onNavigate('progress')}
            className="text-xs flex items-center gap-1"
            style={{ color: '#06B6D4' }}>
            完整报告 <ChevronRight size={14} />
          </button>
        </div>
        {weekLogs.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 size={32} color="#1E2D45" className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: '#64748B' }}>还没有进度记录。开始追踪您的学习时间吧！</p>
            <button onClick={() => onNavigate('progress')}
              className="mt-3 text-xs px-4 py-2 rounded-lg"
              style={{ background: 'rgba(6,182,212,0.2)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.3)' }}>
              记录进度
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {weekLogs.slice(0, 5).map(log => {
              const studied = parseFloat(log.hoursStudied || '0');
              const planned = parseFloat(log.hoursPlanned || '0');
              const maxH = Math.max(planned, studied, 1);
              return (
                <div key={log.id} className="flex items-center gap-3">
                  <span className="text-xs w-20 flex-shrink-0" style={{ color: '#64748B' }}>{log.date}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-12" style={{ color: '#64748B' }}>计划</span>
                      <div className="flex-1 rounded-full h-1.5" style={{ background: '#1E2D45' }}>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(79,70,229,0.6)', width: `${(planned / maxH) * 100}%` }} />
                      </div>
                      <span className="text-xs w-8 text-right" style={{ color: '#64748B' }}>{planned}小时</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-12" style={{ color: '#64748B' }}>实际</span>
                      <div className="flex-1 rounded-full h-1.5" style={{ background: '#1E2D45' }}>
                        <div className="h-1.5 rounded-full" style={{ background: studied >= planned ? '#10B981' : '#F59E0B', width: `${(studied / maxH) * 100}%` }} />
                      </div>
                      <span className="text-xs w-8 text-right" style={{ color: '#64748B' }}>{studied}小时</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Summary */}
      <div className="mt-8">
        <AISummaryComponent />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {
          [
            { label: '添加学习时段', icon: CalendarDays, view: 'schedule' as AppView, color: '#4F46E5' },
            { label: '记录进度', icon: TrendingUp, view: 'progress' as AppView, color: '#10B981' },
            { label: '团队任务', icon: BookOpen, view: 'collab' as AppView, color: '#0EA5E9' },
            { label: 'GPA 预测', icon: BarChart3, view: 'gpa' as AppView, color: '#06B6D4' },
          ].map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => onNavigate(action.view)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${action.color}20` }}>
                  <Icon size={20} color={action.color} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            );
          })
        }
      </div>
    </div>
  );
}
