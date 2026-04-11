import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import OmniflowBadge from '@/components/custom/OmniflowBadge';
import DashboardView from '@/components/custom/DashboardView';
import ScheduleView from '@/components/custom/ScheduleView';
import ProgressView from '@/components/custom/ProgressView';
import CollabView from '@/components/custom/CollabView';
import IntegrationsView from '@/components/custom/IntegrationsView';
import GpaView from '@/components/custom/GpaView';
import type { AppView } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, CalendarDays, TrendingUp, Users, Plug, GraduationCap,
  Menu, X, BookOpen, ChevronRight, Sparkles, CheckCircle2, BarChart3, Zap,
  LogIn, UserPlus, LogOut,
} from 'lucide-react';

const NAV_ITEMS: { id: AppView; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: '仪表板', icon: LayoutDashboard },
  { id: 'schedule', label: '日程', icon: CalendarDays },
  { id: 'progress', label: '进度', icon: TrendingUp },
  { id: 'collab', label: '协作', icon: Users },
  { id: 'gpa', label: 'GPA 预测器', icon: GraduationCap },
  { id: 'integrations', label: '集成', icon: Plug },
];

export default function Index() {
  const [view, setView] = useState<AppView>('landing');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navigate = (v: AppView) => {
    setView(v);
    setMobileOpen(false);
  };

  const handleAuth = (type: 'login' | 'register') => {
    window.location.href = `/auth?type=${type}`;
  };

  const handleLogout = () => {
    logout();
    setView('landing');
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen" style={{ background: '#0B0F1A', color: '#F1F5F9', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
        <Toaster />
        {/* NAVBAR */}
        <nav style={{ borderBottom: '1px solid #1E2D45', background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(12px)' }}
          className="fixed top-0 left-0 right-0 z-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4F46E5' }}>
                  <BookOpen size={16} color="white" />
                </div>
                <span className="font-bold text-lg tracking-tight">Omniflow</span>
                <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full tracking-wide uppercase"
                  style={{ background: 'rgba(79,70,229,0.2)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.3)' }}>Beta</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                {['功能', '日程', '分析', '集成'].map(l => (
                  <a key={l} href={`#${l.toLowerCase()}`} className="text-sm transition-colors duration-200"
                    style={{ color: '#64748B' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>{l}</a>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                    style={{ border: '1px solid #1E2D45', color: '#F1F5F9', background: 'transparent' }}>
                    <LogOut size={14} />
                    登出
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuth('login')}
                      className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                      style={{ border: '1px solid #1E2D45', color: '#F1F5F9', background: 'transparent' }}>
                      <LogIn size={14} />
                      登录
                    </button>
                    <button
                      onClick={() => handleAuth('register')}
                      className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                      style={{ background: '#4F46E5', color: 'white' }}>
                      <UserPlus size={14} />
                      注册
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full" style={{ background: 'rgba(79,70,229,0.1)', filter: 'blur(80px)' }} />
            <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full" style={{ background: 'rgba(6,182,212,0.08)', filter: 'blur(60px)' }} />
          </div>
          <div className="max-w-screen-xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
                style={{ border: '1px solid #1E2D45', background: '#131929' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
                <span className="text-xs tracking-wide" style={{ color: '#64748B' }}>AI驱动的学术日程安排 — 现已推出测试版</span>
              </div>
              <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
                告别临时抱佛脚<br />
                <span style={{ background: 'linear-gradient(to right, #4F46E5, #0EA5E9, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  开始掌握学习
                </span>
              </h1>
              <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: '#64748B' }}>
                Omniflow 同步您的 Canvas 和 Blackboard 截止日期，构建 AI 优化的学习计划，并跟踪您的进度 — 让您专注于学习，而非后勤事务。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                  onClick={() => isAuthenticated ? navigate('dashboard') : handleAuth('register')}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                  style={{ background: '#4F46E5', color: 'white', boxShadow: '0 10px 15px -3px rgba(79,70,229,0.3)' }}>
                  <Sparkles size={18} />
                  免费启动应用
                </button>
                <button
                  onClick={() => isAuthenticated ? navigate('schedule') : handleAuth('login')}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 flex items-center gap-2"
                  style={{ border: '1px solid #1E2D45', color: '#F1F5F9', background: 'transparent' }}>
                  查看日程 <ChevronRight size={16} />
                </button>
              </div>

              {/* Hero image with stats */}
              <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid #1E2D45', boxShadow: '0 25px 50px -12px rgba(79,70,229,0.25)' }}>
                <img
                  src="https://images.unsplash.com/photo-1758270705290-62b6294dd044?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
                  alt="Students studying with laptops"
                  className="w-full h-64 sm:h-80 object-cover"
                  style={{ opacity: 0.55 }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0B0F1A, rgba(11,15,26,0.4), transparent)' }} />
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                  {[
                    { val: '60%', label: 'WAU Activation', color: '#4F46E5' },
                    { val: '50%', label: 'Fewer Late Submissions', color: '#10B981' },
                    { val: '40%', label: 'Less Time Scheduling', color: '#06B6D4' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(19,25,41,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #1E2D45' }}>
                      <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO FEATURES */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#4F46E5' }}>核心功能</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight">助您在学期中脱颖而出的<br />全套工具</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* AI Planning Engine - wide */}
              <div className="lg:col-span-2 rounded-2xl p-6 group relative overflow-hidden transition-all duration-300"
                style={{ background: '#131929', border: '1px solid #1E2D45' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(79,70,229,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2D45')}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ background: 'rgba(79,70,229,0.05)', filter: 'blur(40px)' }} />
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(79,70,229,0.2)' }}>
                    <Sparkles size={20} color="#4F46E5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">智能规划引擎</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>围绕您的课程表拖放学习时段。当考试日期变更时，AI 会自动调整您的计划 — 无需手动重新安排。</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Mon', 'Wed', 'Fri'].map((day, i) => (
                    <div key={day} className="rounded-xl p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                      <div className="text-xs mb-1" style={{ color: '#64748B' }}>{day}</div>
                      <div className="space-y-1">
                        <div className="h-2 rounded-full" style={{ background: 'rgba(79,70,229,0.6)', width: i === 0 ? '100%' : i === 1 ? '80%' : '60%' }} />
                        <div className="h-2 rounded-full" style={{ background: 'rgba(6,182,212,0.6)', width: i === 0 ? '75%' : i === 1 ? '65%' : '100%' }} />
                        <div className="h-2 rounded-full" style={{ background: 'rgba(79,70,229,0.4)', width: i === 0 ? '50%' : i === 1 ? '100%' : '75%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GPA Predictor */}
              <div className="rounded-2xl p-6 transition-all duration-300"
                style={{ background: '#131929', border: '1px solid #1E2D45' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2D45')}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(16,185,129,0.2)' }}>
                  <BarChart3 size={20} color="#10B981" />
                </div>
                <h3 className="font-semibold text-lg mb-2">GPA 预测器</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>根据记录的学习时间预测您的学期 GPA。及时调整努力程度，避免为时已晚。</p>
                <div className="rounded-xl p-4" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs" style={{ color: '#64748B' }}>Predicted GPA</span>
                    <span className="text-2xl font-bold" style={{ color: '#10B981' }}>3.72</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: '#1E2D45' }}>
                    <div className="h-2 rounded-full" style={{ background: 'linear-gradient(to right, #10B981, #06B6D4)', width: '74%' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: '#64748B' }}>2.0</span>
                    <span className="text-xs" style={{ color: '#64748B' }}>4.0</span>
                  </div>
                </div>
              </div>

              {/* Progress Heatmap */}
              <div className="rounded-2xl p-6 transition-all duration-300"
                style={{ background: '#131929', border: '1px solid #1E2D45' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2D45')}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(6,182,212,0.2)' }}>
                  <TrendingUp size={20} color="#06B6D4" />
                </div>
                <h3 className="font-semibold text-lg mb-2">进度热图</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>可视化您整个学期的工作量分布。在倦怠风险发生前发现它们。</p>
                <div className="grid grid-cols-7 gap-1">
                  {[20, 50, 80, 30, 90, 60, 20, 70, 40, 100, 20, 55, 75, 35].map((op, i) => (
                    <div key={i} className="h-5 rounded" style={{ background: `rgba(6,182,212,${op / 100})`, border: op < 30 ? '1px solid #1E2D45' : 'none' }} />
                  ))}
                </div>
              </div>

              {/* Collaboration Hub - wide */}
              <div className="lg:col-span-2 rounded-2xl p-6 transition-all duration-300"
                style={{ background: '#131929', border: '1px solid #1E2D45' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2D45')}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,165,233,0.2)' }}>
                    <Users size={20} color="#0EA5E9" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">协作中心</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>用于小组项目的共享任务板，带有 @ 提及通知。实时更新确保团队在责任和截止日期上保持一致。</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { avatar: 'A', color: '#4F46E5', msg: '@alex completed Literature Review — Section 2', badge: 'Done', badgeColor: '#10B981' },
                    { avatar: 'S', color: '#06B6D4', msg: '@sam assigned Data Analysis to @alex', badge: 'In Progress', badgeColor: '#F59E0B' },
                    { avatar: 'M', color: '#F59E0B', msg: 'Group presentation slides due tomorrow', badge: 'Urgent', badgeColor: '#EF4444' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: item.color }}>{item.avatar}</div>
                      <p className="text-sm flex-1 min-w-0 truncate">{item.msg}</p>
                      <span className="text-xs flex-shrink-0" style={{ color: item.badgeColor }}>{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Reports */}
              <div className="rounded-2xl p-6 transition-all duration-300"
                style={{ background: '#131929', border: '1px solid #1E2D45' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2D45')}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(245,158,11,0.2)' }}>
                  <BarChart3 size={20} color="#F59E0B" />
                </div>
                <h3 className="font-semibold text-lg mb-2">周报告</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>比较计划与实际学习时间。识别时间管理差距并及早调整。</p>
                <div className="space-y-2">
                  {[{ label: 'Planned', pct: '80%', val: '16h', color: 'rgba(79,70,229,0.6)' }, { label: 'Actual', pct: '55%', val: '11h', color: '#F59E0B' }].map(r => (
                    <div key={r.label} className="flex items-center gap-2">
                      <span className="text-xs w-16" style={{ color: '#64748B' }}>{r.label}</span>
                      <div className="flex-1 rounded-full h-2" style={{ background: '#1E2D45' }}>
                        <div className="h-2 rounded-full" style={{ background: r.color, width: r.pct }} />
                      </div>
                      <span className="text-xs" style={{ color: '#64748B' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCHEDULE SECTION */}
        <section id="schedule" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(19,25,41,0.3)' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#4F46E5' }}>智能日程安排</p>
                <h2 className="font-bold text-4xl sm:text-5xl tracking-tight mb-6">您的一周，<br />智能规划。</h2>
                <p className="leading-relaxed mb-8" style={{ color: '#64748B' }}>Omniflow 分析您的课程难度、能量模式和现有承诺，推荐最佳学习时段。拖放即可完成 — AI 处理其余部分。</p>
                <ul className="space-y-4">
                  {[
                    { title: '自动同步 Canvas 和 Blackboard', desc: '所有截止日期自动集中管理 — 无需手动输入。' },
                    { title: '考试变更时动态重新安排', desc: '教授更改期中考试时间？您的计划立即更新。' },
                    { title: '导出到 Google 日历', desc: '无缝查看学术截止日期和个人事件。' },
                  ].map(item => (
                    <li key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 size={18} color="#10B981" className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => isAuthenticated ? navigate('schedule') : handleAuth('login')}
                  className="mt-8 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                  style={{ background: '#4F46E5', color: 'white' }}>
                  打开日程 <ChevronRight size={16} />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
                  <h4 className="font-semibold text-sm">本周 — 3月14日至20日</h4>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { time: '9:00 AM', title: '微积分 III — 学习时段', sub: '2小时 · AI 推荐', color: '#4F46E5' },
                    { time: '11:30 AM', title: '有机化学 — 复习', sub: '1.5小时 · 3天后考试', color: '#06B6D4' },
                    { time: '2:00 PM', title: '论文 — 第3章草稿', sub: '3小时 · 周五截止', color: '#F59E0B' },
                    { time: '5:30 PM', title: '小组项目 — 数据分析', sub: '1小时 · 与 @sam, @maya 共享', color: '#10B981' },
                  ].map(s => (
                    <div key={s.time} className="flex items-center gap-2">
                      <span className="text-xs w-16 flex-shrink-0" style={{ color: '#64748B' }}>{s.time}</span>
                      <div className="flex-1 rounded-lg px-3 py-2" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                        <p className="text-xs font-medium" style={{ color: s.color }}>{s.title}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ANALYTICS SECTION */}
        <section id="analytics" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#06B6D4' }}>进度跟踪</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight">数据驱动的洞察<br />为每位学生</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: '本周学习时间', badge: '+12%', badgeColor: '#10B981', badgeBg: 'rgba(16,185,129,0.1)',
                  main: '23.5', unit: '小时', sub: 'vs. 计划 21小时',
                  bars: [40, 65, 50, 80, 100, 70, 30], barColor: '#4F46E5',
                },
                {
                  title: '本月截止日期', badge: '3个即将到来', badgeColor: '#F59E0B', badgeBg: 'rgba(245,158,11,0.1)',
                  items: [
                    { dot: '#EF4444', name: '有机化学期中考试', date: '3月17日 · 3天' },
                    { dot: '#F59E0B', name: '论文第3章草稿', date: '3月21日 · 7天' },
                    { dot: '#10B981', name: '计算机科学项目提交', date: '3月28日 · 14天' },
                  ],
                },
                {
                  title: '论文进度', badge: '按计划进行', badgeColor: '#06B6D4', badgeBg: 'rgba(6,182,212,0.1)',
                  main: '68', unit: '%', sub: '已起草 42/62 页',
                  chapters: [
                    { name: '第1章', status: '已完成', pct: 100, color: '#10B981' },
                    { name: '第2章', status: '已完成', pct: 100, color: '#10B981' },
                    { name: '第3章', status: '进行中', pct: 40, color: '#F59E0B' },
                  ],
                },
              ].map((card, ci) => (
                <div key={ci} className="rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold">{card.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: card.badgeColor, background: card.badgeBg }}>{card.badge}</span>
                  </div>
                  {card.main && (
                    <>
                      <div className="text-4xl font-bold mb-1">{card.main}<span className="text-lg font-normal" style={{ color: '#64748B' }}>{card.unit}</span></div>
                      <p className="text-xs mb-4" style={{ color: '#64748B' }}>{card.sub}</p>
                    </>
                  )}
                  {card.bars && (
                    <div className="flex gap-1 items-end h-12">
                      {card.bars.map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `rgba(79,70,229,${h / 100 + 0.2})` }} />
                      ))}
                    </div>
                  )}
                  {card.items && (
                    <div className="space-y-3">
                      {card.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                          <div className="flex-1">
                            <p className="text-xs font-medium">{item.name}</p>
                            <p className="text-xs" style={{ color: '#64748B' }}>{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {card.chapters && (
                    <div className="space-y-2">
                      {card.chapters.map((ch, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1" style={{ color: '#64748B' }}>
                            <span>{ch.name}</span>
                            <span style={{ color: ch.color }}>{ch.status}</span>
                          </div>
                          <div className="w-full rounded-full h-1.5" style={{ background: '#1E2D45' }}>
                            <div className="h-1.5 rounded-full" style={{ background: ch.color, width: `${ch.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(19,25,41,0.3)' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0EA5E9' }}>跨平台集成</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight">与您已使用的工具<br />无缝连接</h2>
              <p className="mt-4 max-w-xl mx-auto" style={{ color: '#64748B' }}>Omniflow 与您的大学 LMS 和个人日历双向集成 — 确保您的学术生活始终保持同步。</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {
                [
                  { name: 'Canvas LMS', desc: '自动同步作业、测验和考试日期', color: '#4F46E5', hoverColor: 'rgba(79,70,229,0.5)' },
                  { name: 'Blackboard', desc: '拉取课程材料和截止日期通知', color: '#0EA5E9', hoverColor: 'rgba(14,165,233,0.5)' },
                  { name: 'Google 日历', desc: '导出学习时段与个人事件一起', color: '#06B6D4', hoverColor: 'rgba(6,182,212,0.5)' },
                  { name: '顾问仪表板', desc: '顾问通过 LMS 数据监控有风险的学生', color: '#10B981', hoverColor: 'rgba(16,185,129,0.5)' },
                ].map(int => (
                  <div key={int.name} className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                    style={{ background: '#131929', border: '1px solid #1E2D45' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = int.hoverColor)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E2D45')}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                      <Plug size={24} color={int.color} />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{int.name}</h4>
                    <p className="text-xs" style={{ color: '#64748B' }}>{int.desc}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.2), #131929, rgba(6,182,212,0.1))', border: '1px solid #1E2D45' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none" style={{ background: 'rgba(79,70,229,0.15)', filter: 'blur(60px)' }} />
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#4F46E5' }}>立即开始</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight mb-6">您的最佳学期<br />从这里开始。</h2>
              <p className="max-w-lg mx-auto mb-10" style={{ color: '#64748B' }}>加入成千上万的学生，他们已经使用 Omniflow 消除了临时抱佛脚和错过截止日期的问题。</p>
              <button
                  onClick={() => isAuthenticated ? navigate('dashboard') : handleAuth('register')}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
                  style={{ background: '#4F46E5', color: 'white', boxShadow: '0 10px 15px -3px rgba(79,70,229,0.3)' }}>
                  <Zap size={18} />
                  免费启动 Omniflow
                </button>
                <p className="text-xs mt-4" style={{ color: '#64748B' }}>学生免费使用 · 包含 Canvas 和 Blackboard 同步 · 无需信用卡</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid #1E2D45' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#4F46E5' }}>
                    <BookOpen size={14} color="white" />
                  </div>
                  <span className="font-bold">Omniflow</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>为现代学生打造的 AI 驱动学习规划工具。支持 Canvas、Blackboard 等平台。</p>
              </div>
              {
                [
                  { title: '产品', links: ['功能', '集成', '定价', '更新日志'] },
                  { title: '面向学生', links: ['本科生', '研究生', '学术顾问', '大学'] },
                  { title: '公司', links: ['关于我们', '博客', '隐私政策', '服务条款'] },
                ].map(col => (
                  <div key={col.title}>
                    <h5 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#64748B' }}>{col.title}</h5>
                    <ul className="space-y-2">
                      {col.links.map(l => (
                        <li key={l}><a href="#" className="text-sm transition-colors" style={{ color: '#64748B' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>{l}</a></li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid #1E2D45' }}>
              <p className="text-xs" style={{ color: '#64748B' }}>© 2026 Omniflow. 由 Zhang BINGsi 开发。保留所有权利。</p>
              <p className="text-xs" style={{ color: '#64748B' }}>为拒绝平庸的学生设计。</p>
            </div>
          </div>
        </footer>
        <OmniflowBadge />
      </div>
    );
  }

  // App Shell with sidebar navigation
  return (
    <div className="min-h-screen flex" style={{ background: '#0B0F1A', color: '#F1F5F9', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      <Toaster />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ width: 240, background: '#131929', borderRight: '1px solid #1E2D45', minHeight: '100vh' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #1E2D45' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4F46E5' }}>
            <BookOpen size={16} color="white" />
          </div>
          <span className="font-bold text-base tracking-tight">Omniflow</span>
          <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: active ? 'rgba(79,70,229,0.2)' : 'transparent',
                  color: active ? '#4F46E5' : '#64748B',
                  border: active ? '1px solid rgba(79,70,229,0.3)' : '1px solid transparent',
                }}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Back to landing */}
        <div className="px-3 pb-4">
          <button
            onClick={() => navigate('landing')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ color: '#64748B', border: '1px solid #1E2D45' }}>
            <BookOpen size={18} />
            返回首页
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 sm:px-6 py-4 lg:hidden" style={{ borderBottom: '1px solid #1E2D45', background: '#131929' }}>
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={22} color="#F1F5F9" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#4F46E5' }}>
              <BookOpen size={14} color="white" />
            </div>
            <span className="font-bold text-sm">Omniflow</span>
          </div>
          <span className="ml-auto text-sm font-medium" style={{ color: '#64748B' }}>
            {NAV_ITEMS.find(n => n.id === view)?.label}
          </span>
        </header>

        <main className="flex-1 overflow-auto">
          {view === 'dashboard' && <DashboardView onNavigate={(v) => setView(v as AppView)} />}
          {view === 'schedule' && <ScheduleView />}
          {view === 'progress' && <ProgressView />}
          {view === 'collab' && <CollabView />}
          {view === 'gpa' && <GpaView />}
          {view === 'integrations' && <IntegrationsView />}
        </main>
      </div>

      <OmniflowBadge />
    </div>
  );
}
