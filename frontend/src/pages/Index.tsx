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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'collab', label: 'Collaboration', icon: Users },
  { id: 'gpa', label: 'GPA Predictor', icon: GraduationCap },
  { id: 'integrations', label: 'Integrations', icon: Plug },
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
                {['Features', 'Schedule', 'Analytics', 'Integrations'].map(l => (
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
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuth('login')}
                      className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                      style={{ border: '1px solid #1E2D45', color: '#F1F5F9', background: 'transparent' }}>
                      <LogIn size={14} />
                      Login
                    </button>
                    <button
                      onClick={() => handleAuth('register')}
                      className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                      style={{ background: '#4F46E5', color: 'white' }}>
                      <UserPlus size={14} />
                      Register
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
                <span className="text-xs tracking-wide" style={{ color: '#64748B' }}>AI-Powered Academic Scheduling — Now in Beta</span>
              </div>
              <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
                Stop Cramming.<br />
                <span style={{ background: 'linear-gradient(to right, #4F46E5, #0EA5E9, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Start Mastering.
                </span>
              </h1>
              <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: '#64748B' }}>
                Omniflow syncs your Canvas &amp; Blackboard deadlines, builds AI-optimized study plans, and tracks your progress — so you can focus on learning, not logistics.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                  onClick={() => isAuthenticated ? navigate('dashboard') : handleAuth('register')}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                  style={{ background: '#4F46E5', color: 'white', boxShadow: '0 10px 15px -3px rgba(79,70,229,0.3)' }}>
                  <Sparkles size={18} />
                  Launch App — Free
                </button>
                <button
                  onClick={() => isAuthenticated ? navigate('schedule') : handleAuth('login')}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 flex items-center gap-2"
                  style={{ border: '1px solid #1E2D45', color: '#F1F5F9', background: 'transparent' }}>
                  View Schedule <ChevronRight size={16} />
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#4F46E5' }}>Core Features</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight">Everything you need to<br />ace the semester</h2>
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
                    <h3 className="font-semibold text-lg mb-1">Intelligent Planning Engine</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>Drag-and-drop study sessions around your class schedule. The AI auto-adjusts your plan when exam dates shift — no manual rescheduling needed.</p>
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
                <h3 className="font-semibold text-lg mb-2">GPA Predictor</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>Forecast your semester GPA based on study hours logged. Adjust effort before it is too late.</p>
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
                <h3 className="font-semibold text-lg mb-2">Progress Heatmaps</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>Visualize your workload distribution across the semester. Spot burnout risks before they happen.</p>
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
                    <h3 className="font-semibold text-lg mb-1">Collaboration Hub</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>Shared task boards for group projects with @mention notifications. Real-time updates keep your team aligned on responsibilities and deadlines.</p>
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
                <h3 className="font-semibold text-lg mb-2">Weekly Reports</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>Compare planned vs. actual study hours. Identify time management gaps and course-correct early.</p>
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
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#4F46E5' }}>Smart Scheduling</p>
                <h2 className="font-bold text-4xl sm:text-5xl tracking-tight mb-6">Your week,<br />intelligently planned.</h2>
                <p className="leading-relaxed mb-8" style={{ color: '#64748B' }}>Omniflow analyzes your course difficulty, energy patterns, and existing commitments to recommend optimal study blocks. Drag, drop, and done — the AI handles the rest.</p>
                <ul className="space-y-4">
                  {[
                    { title: 'Auto-sync from Canvas & Blackboard', desc: 'All deadlines centralized automatically — no manual entry.' },
                    { title: 'Dynamic rescheduling on exam changes', desc: 'Professor moved the midterm? Your plan updates instantly.' },
                    { title: 'Export to Google Calendar', desc: 'View academic deadlines alongside personal events seamlessly.' },
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
                  Open Schedule <ChevronRight size={16} />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
                  <h4 className="font-semibold text-sm">This Week — March 14–20</h4>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { time: '9:00 AM', title: 'Calculus III — Study Block', sub: '2h · AI Recommended', color: '#4F46E5' },
                    { time: '11:30 AM', title: 'Organic Chemistry — Review', sub: '1.5h · Exam in 3 days', color: '#06B6D4' },
                    { time: '2:00 PM', title: 'Thesis — Chapter 3 Draft', sub: '3h · Milestone due Friday', color: '#F59E0B' },
                    { time: '5:30 PM', title: 'Group Project — Data Analysis', sub: '1h · Shared with @sam, @maya', color: '#10B981' },
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#06B6D4' }}>Progress Tracking</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight">Data-driven insights<br />for every student</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Study Hours This Week', badge: '+12%', badgeColor: '#10B981', badgeBg: 'rgba(16,185,129,0.1)',
                  main: '23.5', unit: 'h', sub: 'vs. 21h planned',
                  bars: [40, 65, 50, 80, 100, 70, 30], barColor: '#4F46E5',
                },
                {
                  title: 'Deadlines This Month', badge: '3 upcoming', badgeColor: '#F59E0B', badgeBg: 'rgba(245,158,11,0.1)',
                  items: [
                    { dot: '#EF4444', name: 'Organic Chem Midterm', date: 'Mar 17 · 3 days' },
                    { dot: '#F59E0B', name: 'Thesis Chapter 3 Draft', date: 'Mar 21 · 7 days' },
                    { dot: '#10B981', name: 'CS Project Submission', date: 'Mar 28 · 14 days' },
                  ],
                },
                {
                  title: 'Thesis Progress', badge: 'On Track', badgeColor: '#06B6D4', badgeBg: 'rgba(6,182,212,0.1)',
                  main: '68', unit: '%', sub: '42 of 62 pages drafted',
                  chapters: [
                    { name: 'Chapter 1', status: 'Complete', pct: 100, color: '#10B981' },
                    { name: 'Chapter 2', status: 'Complete', pct: 100, color: '#10B981' },
                    { name: 'Chapter 3', status: 'In Progress', pct: 40, color: '#F59E0B' },
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0EA5E9' }}>Cross-Platform Integration</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight">Connects with the tools<br />you already use</h2>
              <p className="mt-4 max-w-xl mx-auto" style={{ color: '#64748B' }}>Omniflow integrates bidirectionally with your university LMS and personal calendar — so your academic life is always in sync.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {
                [
                  { name: 'Canvas LMS', desc: 'Auto-sync assignments, quizzes, and exam dates', color: '#4F46E5', hoverColor: 'rgba(79,70,229,0.5)' },
                  { name: 'Blackboard', desc: 'Pull course materials and deadline notifications', color: '#0EA5E9', hoverColor: 'rgba(14,165,233,0.5)' },
                  { name: 'Google Calendar', desc: 'Export study blocks alongside personal events', color: '#06B6D4', hoverColor: 'rgba(6,182,212,0.5)' },
                  { name: 'Advisor Dashboard', desc: 'Advisors monitor at-risk students via LMS data', color: '#10B981', hoverColor: 'rgba(16,185,129,0.5)' },
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#4F46E5' }}>Get Started Today</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight mb-6">Your best semester<br />starts here.</h2>
              <p className="max-w-lg mx-auto mb-10" style={{ color: '#64748B' }}>Join thousands of students who have eliminated last-minute cramming and missed deadlines with Omniflow.</p>
              <button
                  onClick={() => isAuthenticated ? navigate('dashboard') : handleAuth('register')}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
                  style={{ background: '#4F46E5', color: 'white', boxShadow: '0 10px 15px -3px rgba(79,70,229,0.3)' }}>
                  <Zap size={18} />
                  Launch Omniflow Free
                </button>
                <p className="text-xs mt-4" style={{ color: '#64748B' }}>Free for students · Canvas &amp; Blackboard sync included · No credit card</p>
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
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>AI-powered study planning for the modern student. Built for Canvas, Blackboard, and beyond.</p>
              </div>
              {
                [
                  { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
                  { title: 'For Students', links: ['Undergraduates', 'Graduate Students', 'Academic Advisors', 'Universities'] },
                  { title: 'Company', links: ['About', 'Blog', 'Privacy', 'Terms'] },
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
              <p className="text-xs" style={{ color: '#64748B' }}>© 2026 Omniflow. Built by Zhang BINGsi. All rights reserved.</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Designed for students who refuse to settle for average.</p>
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
            Back to Home
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
