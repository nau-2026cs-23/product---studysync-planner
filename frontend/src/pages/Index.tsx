import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import DashboardView from '@/components/custom/DashboardView';
import ScheduleView from '@/components/custom/ScheduleView';
import ProgressView from '@/components/custom/ProgressView';
import CollabView from '@/components/custom/CollabView';
import IntegrationsView from '@/components/custom/IntegrationsView';
import GpaView from '@/components/custom/GpaView';
import ThemeSelector from '@/components/ui/ThemeSelector';
import LanguageSelector from '@/components/ui/LanguageSelector';
import type { AppView } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard, CalendarDays, TrendingUp, Users, Plug, GraduationCap,
  Menu, X, BookOpen, ChevronRight, Sparkles, CheckCircle2, BarChart3, Zap,
  LogIn, UserPlus, LogOut, Brain, Clock, FileText, BarChart2,
} from 'lucide-react';

export default function Index() {
  const [view, setView] = useState<AppView>('landing');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const NAV_ITEMS: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'schedule', label: t('schedule'), icon: CalendarDays },
    { id: 'progress', label: '进度', icon: BarChart2 },
    { id: 'collab', label: t('collab'), icon: Users },
    { id: 'gpa', label: t('gpa'), icon: BarChart3 },
    { id: 'integrations', label: t('integrations'), icon: Plug },
  ];

  const navigate = (v: AppView) => {
    setView(v);
    setMobileOpen(false);
  };

  const handleAuth = (type: 'login' | 'register') => {
    window.location.href = `/#/auth?type=${type}`;
  };

  const handleLogout = () => {
    logout();
    setView('landing');
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen" style={{ background: theme.background, color: theme.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Toaster />
        {/* NAVBAR */}
        <nav style={{ borderBottom: `1px solid ${theme.border}`, background: `rgba(13,17,23,0.9)`, backdropFilter: 'blur(20px)' }}
          className="fixed top-0 left-0 right-0 z-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                  <BookOpen size={18} color="white" />
                </div>
                <span className="font-bold text-xl tracking-tight" style={{ color: theme.text }}>StudySync</span>
                <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-0.5 rounded-full tracking-wide uppercase"
                  style={{ background: `${theme.accent}20`, color: theme.accent, border: `1px solid ${theme.accent}40` }}>Beta</span>
              </div>
              <div className="hidden md:flex items-center gap-10">
                {['features', 'schedule', 'analytics', 'integrations'].map(key => (
                  <a key={key} href={`#${key}`} className="text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{ color: theme.textSecondary }}
                    onMouseEnter={e => (e.currentTarget.style.color = theme.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}>{t(key)}</a>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <ThemeSelector />
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2"
                    style={{ border: `1px solid ${theme.border}`, color: theme.text, background: 'transparent' }}>
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuth('login')}
                      className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                      style={{ border: `1px solid ${theme.border}`, color: theme.text, background: 'transparent' }}>
                      <LogIn size={16} />
                      {t('login')}
                    </button>
                    <button
                      onClick={() => handleAuth('register')}
                      className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: 'white', boxShadow: `0 4px 12px ${theme.accent}30` }}>
                      <UserPlus size={16} />
                      {t('signUp')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-24 left-1/4 w-96 h-96 rounded-full animate-pulse" style={{ background: `${theme.accent}10`, filter: 'blur(90px)' }} />
            <div className="absolute top-48 right-1/4 w-64 h-64 rounded-full animate-pulse" style={{ background: `${theme.primary}08`, filter: 'blur(70px)' }} />
            <div className="absolute bottom-16 left-1/3 w-80 h-80 rounded-full animate-pulse" style={{ background: `${theme.secondary}05`, filter: 'blur(70px)' }} />
          </div>
          <div className="max-w-screen-xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 transition-all duration-300 hover:scale-105"
                style={{ border: `1px solid ${theme.border}`, background: theme.surface }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.secondary }} />
                <span className="text-xs tracking-wide" style={{ color: theme.textSecondary }}>AI-Powered Academic Scheduling — Now in Beta</span>
              </div>
              <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-8 animate-fade-in" style={{ color: theme.text }}>
                {t('heroTitle')}
              </h1>
              <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-in delay-200" style={{ color: theme.textSecondary }}>
                {t('heroDescription')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
                <button
                  onClick={() => isAuthenticated ? navigate('dashboard') : handleAuth('register')}
                  className="px-9 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 group"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, color: 'white', boxShadow: `0 8px 24px ${theme.accent}30` }}>
                  <Sparkles size={20} className="transition-transform duration-300 group-hover:rotate-12" />
                  {t('startFree')}
                </button>
                <button
                  onClick={() => isAuthenticated ? navigate('schedule') : handleAuth('login')}
                  className="px-9 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2 group"
                  style={{ border: `1px solid ${theme.border}`, color: theme.text, background: 'transparent' }}>
                  {t('viewSchedule')} <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Hero image with stats */}
              <div className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl" style={{ border: `1px solid ${theme.border}`, boxShadow: `0 25px 50px -12px ${theme.accent}20` }}>
                <img
                  src="https://images.unsplash.com/photo-1758270705290-62b6294dd044?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
                  alt="Students studying with laptops"
                  className="w-full h-72 sm:h-96 object-cover transition-transform duration-700 hover:scale-105"
                  style={{ opacity: 0.6 }}
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.background}, rgba(13,17,23,0.4), transparent)` }} />
                <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-4">
                  {[
                    { val: '60%', label: 'WAU Activation', color: theme.accent },
                    { val: '50%', label: 'Fewer Late Submissions', color: theme.secondary },
                    { val: '40%', label: 'Less Time Scheduling', color: theme.primary },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-105" style={{ background: `${theme.surface}E0`, backdropFilter: 'blur(16px)', border: `1px solid ${theme.border}` }}>
                      <div className="text-2xl font-bold transition-all duration-300 hover:scale-110" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>{s.label}</div>
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-3 transition-all duration-300 hover:scale-105" style={{ color: theme.primary }}>{t('featuresSubtitle')}</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight animate-fade-in" style={{ color: theme.text }}>{t('featuresTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* AI Planning Engine - wide */}
              <div className="lg:col-span-2 rounded-2xl p-6 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
                style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${theme.primary}50`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = theme.border)}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full transition-all duration-700 group-hover:scale-125" style={{ background: `${theme.primary}05`, filter: 'blur(40px)' }} />
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: `${theme.primary}20` }}>
                    <Sparkles size={20} color={theme.primary} className="transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 transition-all duration-300 group-hover:text-white" style={{ color: theme.text }}>{t('smartPlanningEngine')}</h3>
                    <p className="text-sm leading-relaxed transition-all duration-300 group-hover:opacity-90" style={{ color: theme.textSecondary }}>{t('smartPlanningDescription')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Mon', 'Wed', 'Fri'].map((day, i) => (
                    <div key={day} className="rounded-xl p-3 transition-all duration-300 hover:scale-105" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                      <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>{day}</div>
                      <div className="space-y-1">
                        <div className="h-2 rounded-full transition-all duration-500 hover:opacity-100" style={{ background: `${theme.primary}60`, width: i === 0 ? '100%' : i === 1 ? '80%' : '60%' }} />
                        <div className="h-2 rounded-full transition-all duration-500 hover:opacity-100" style={{ background: `${theme.accent}60`, width: i === 0 ? '75%' : i === 1 ? '65%' : '100%' }} />
                        <div className="h-2 rounded-full transition-all duration-500 hover:opacity-100" style={{ background: `${theme.primary}40`, width: i === 0 ? '50%' : i === 1 ? '100%' : '75%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GPA Predictor */}
              <div className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
                style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${theme.secondary}50`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = theme.border)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110" style={{ background: `${theme.secondary}20` }}>
                  <BarChart3 size={20} color={theme.secondary} className="transition-transform duration-300 hover:rotate-12" />
                </div>
                <h3 className="font-semibold text-lg mb-2 transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{t('gpaPredictor')}</h3>
                <p className="text-sm leading-relaxed mb-4 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('gpaPredictorDescription')}</p>
                <div className="rounded-xl p-4 transition-all duration-300 hover:scale-105" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs" style={{ color: theme.textSecondary }}>Predicted GPA</span>
                    <span className="text-2xl font-bold transition-all duration-300 hover:scale-110" style={{ color: theme.secondary }}>3.72</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: theme.border }}>
                    <div className="h-2 rounded-full transition-all duration-700 hover:width-[80%]" style={{ background: `linear-gradient(to right, ${theme.secondary}, ${theme.accent})`, width: '74%' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: theme.textSecondary }}>2.0</span>
                    <span className="text-xs" style={{ color: theme.textSecondary }}>4.0</span>
                  </div>
                </div>
              </div>

              {/* Progress Heatmap */}
              <div className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
                style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${theme.accent}50`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = theme.border)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110" style={{ background: `${theme.accent}20` }}>
                  <TrendingUp size={20} color={theme.accent} className="transition-transform duration-300 hover:rotate-12" />
                </div>
                <h3 className="font-semibold text-lg mb-2 transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{t('progressHeatmap')}</h3>
                <p className="text-sm leading-relaxed mb-4 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('progressHeatmapDescription')}</p>
                <div className="grid grid-cols-7 gap-1">
                  {[20, 50, 80, 30, 90, 60, 20, 70, 40, 100, 20, 55, 75, 35].map((op, i) => (
                    <div key={i} className="h-5 rounded transition-all duration-300 hover:scale-110" style={{ background: `rgba(6,182,212,${op / 100})`, border: op < 30 ? `1px solid ${theme.border}` : 'none' }} />
                  ))}
                </div>
              </div>

              {/* Collaboration Hub - wide */}
              <div className="lg:col-span-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
                style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${theme.accent}50`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = theme.border)}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ background: `${theme.accent}20` }}>
                    <Users size={20} color={theme.accent} className="transition-transform duration-300 hover:rotate-12" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{t('collaborationHub')}</h3>
                    <p className="text-sm leading-relaxed transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('collaborationHubDescription')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { avatar: 'A', color: theme.primary, msg: '@alex completed Literature Review — Section 2', badge: 'Done', badgeColor: theme.secondary },
                    { avatar: 'S', color: theme.accent, msg: '@sam assigned Data Analysis to @alex', badge: 'In Progress', badgeColor: '#F59E0B' },
                    { avatar: 'M', color: '#F59E0B', msg: 'Group presentation slides due tomorrow', badge: 'Urgent', badgeColor: '#EF4444' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:scale-102" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ background: item.color }}>{item.avatar}</div>
                      <p className="text-sm flex-1 min-w-0 truncate transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{item.msg}</p>
                      <span className="text-xs flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ color: item.badgeColor }}>{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Reports */}
              <div className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
                style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `rgba(245,158,11,0.5)`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = theme.border)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110" style={{ background: `rgba(245,158,11,0.2)` }}>
                  <BarChart3 size={20} color="#F59E0B" className="transition-transform duration-300 hover:rotate-12" />
                </div>
                <h3 className="font-semibold text-lg mb-2 transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{t('weeklyReports')}</h3>
                <p className="text-sm leading-relaxed mb-4 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('weeklyReportsDescription')}</p>
                <div className="space-y-2">
                  {[{ label: 'Planned', pct: '80%', val: '16h', color: `${theme.primary}60` }, { label: 'Actual', pct: '55%', val: '11h', color: '#F59E0B' }].map(r => (
                    <div key={r.label} className="flex items-center gap-2 transition-all duration-300 hover:scale-102">
                      <span className="text-xs w-16" style={{ color: theme.textSecondary }}>{r.label}</span>
                      <div className="flex-1 rounded-full h-2" style={{ background: theme.border }}>
                        <div className="h-2 rounded-full transition-all duration-700 hover:width-[90%]" style={{ background: r.color, width: r.pct }} />
                      </div>
                      <span className="text-xs transition-all duration-300 hover:text-white" style={{ color: theme.textSecondary }}>{r.val}</span>
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
              <div className="animate-fade-in">
                <p className="text-xs font-semibold tracking-widest uppercase mb-3 transition-all duration-300 hover:scale-105" style={{ color: theme.primary }}>{t('smartPlanningEngine')}</p>
                <h2 className="font-bold text-4xl sm:text-5xl tracking-tight mb-6 transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{t('scheduleTitle')}</h2>
                <p className="leading-relaxed mb-8 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('scheduleDescription')}</p>
                <ul className="space-y-4">
                  {[
                    { title: t('autoSync'), desc: t('autoSyncDescription') },
                    { title: t('dynamicRescheduling'), desc: t('dynamicReschedulingDescription') },
                    { title: t('exportToGoogleCalendar'), desc: t('exportToGoogleCalendarDescription') },
                  ].map((item, index) => (
                    <li key={item.title} className="flex items-start gap-3 transition-all duration-300 hover:scale-102 animate-fade-in delay-100">
                      <CheckCircle2 size={18} color={theme.secondary} className="flex-shrink-0 mt-0.5 transition-all duration-300 hover:scale-110" />
                      <div>
                        <p className="text-sm font-medium transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{item.title}</p>
                        <p className="text-xs mt-0.5 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => isAuthenticated ? navigate('schedule') : handleAuth('login')}
                  className="mt-8 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 group"
                  style={{ background: theme.primary, color: 'white' }}>
                  {t('openSchedule')} <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between px-5 py-4 transition-all duration-300 hover:bg-opacity-90" style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <h4 className="font-semibold text-sm transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{t('thisWeek')}</h4>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { time: '9:00 AM', title: t('calculusStudySession'), sub: '2小时 · AI 推荐', color: theme.primary },
                    { time: '11:30 AM', title: t('organicChemistryReview'), sub: '1.5小时 · 3天后考试', color: theme.accent },
                    { time: '2:00 PM', title: t('paperDraft'), sub: '3小时 · 周五截止', color: '#F59E0B' },
                    { time: '5:30 PM', title: t('groupProject'), sub: '1小时 · 与 @sam, @maya 共享', color: theme.secondary },
                  ].map((s, index) => (
                    <div key={s.time} className="flex items-center gap-2 transition-all duration-300 hover:scale-102 animate-fade-in delay-200">
                      <span className="text-xs w-16 flex-shrink-0 transition-all duration-300 hover:text-white" style={{ color: theme.textSecondary }}>{s.time}</span>
                      <div className="flex-1 rounded-lg px-3 py-2 transition-all duration-300 hover:scale-105" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                        <p className="text-xs font-medium transition-all duration-300 hover:scale-105" style={{ color: s.color }}>{s.title}</p>
                        <p className="text-xs transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{s.sub}</p>
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-3 transition-all duration-300 hover:scale-105" style={{ color: theme.accent }}>进度跟踪</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight animate-fade-in" style={{ color: theme.text }}>{t('analyticsTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                title: t('studyTimeThisWeek'), badge: '+12%', badgeColor: theme.secondary, badgeBg: `${theme.secondary}10`,
                main: '23.5', unit: '小时', sub: t('vsPlanned'),
                bars: [40, 65, 50, 80, 100, 70, 30], barColor: theme.primary,
              },
              {
                title: t('deadlinesThisMonth'), badge: '3个即将到来', badgeColor: '#F59E0B', badgeBg: 'rgba(245,158,11,0.1)',
                items: [
                  { dot: '#EF4444', name: t('organicChemistryMidterm'), date: '3月17日 · 3天' },
                  { dot: '#F59E0B', name: t('paperChapterDraft'), date: '3月21日 · 7天' },
                  { dot: theme.secondary, name: t('computerScienceProject'), date: '3月28日 · 14天' },
                ],
              },
              {
                title: t('paperProgress'), badge: '按计划进行', badgeColor: theme.accent, badgeBg: `${theme.accent}10`,
                main: '68', unit: '%', sub: t('pagesDrafted'),
                chapters: [
                  { name: '第1章', status: '已完成', pct: 100, color: theme.secondary },
                  { name: '第2章', status: '已完成', pct: 100, color: theme.secondary },
                  { name: '第3章', status: '进行中', pct: 40, color: '#F59E0B' },
                ],
              },
              ].map((card, ci) => (
                <div key={ci} className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] animate-fade-in delay-100" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{card.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full transition-all duration-300 hover:scale-105" style={{ color: card.badgeColor, background: card.badgeBg }}>{card.badge}</span>
                  </div>
                  {card.main && (
                    <>
                      <div className="text-4xl font-bold mb-1 transition-all duration-300 hover:scale-105" style={{ color: theme.text }}>{card.main}<span className="text-lg font-normal" style={{ color: theme.textSecondary }}>{card.unit}</span></div>
                      <p className="text-xs mb-4 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{card.sub}</p>
                    </>
                  )}
                  {card.bars && (
                    <div className="flex gap-1 items-end h-12">
                      {card.bars.map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm transition-all duration-700 hover:scale-110" style={{ height: `${h}%`, background: `rgba(79,70,229,${h / 100 + 0.2})` }} />
                      ))}
                    </div>
                  )}
                  {card.items && (
                    <div className="space-y-3">
                      {card.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 transition-all duration-300 hover:scale-102">
                          <div className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-150" style={{ background: item.dot }} />
                          <div className="flex-1">
                            <p className="text-xs font-medium transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{item.name}</p>
                            <p className="text-xs transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {card.chapters && (
                    <div className="space-y-2">
                      {card.chapters.map((ch, i) => (
                        <div key={i} className="transition-all duration-300 hover:scale-102">
                          <div className="flex justify-between text-xs mb-1" style={{ color: theme.textSecondary }}>
                            <span className="transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{ch.name}</span>
                            <span className="transition-all duration-300 hover:scale-105" style={{ color: ch.color }}>{ch.status}</span>
                          </div>
                          <div className="w-full rounded-full h-1.5" style={{ background: theme.border }}>
                            <div className="h-1.5 rounded-full transition-all duration-700 hover:width-[100%]" style={{ background: ch.color, width: `${ch.pct}%` }} />
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-3 transition-all duration-300 hover:scale-105" style={{ color: theme.accent }}>跨平台集成</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight animate-fade-in" style={{ color: theme.text }}>{t('integrationsTitle')}</h2>
              <p className="mt-4 max-w-xl mx-auto transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('integrationsDescription')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {
                [
                  { name: t('canvasLMS'), desc: t('canvasLMSDescription'), color: theme.primary, hoverColor: `${theme.primary}50` },
                  { name: t('blackboard'), desc: t('blackboardDescription'), color: theme.accent, hoverColor: `${theme.accent}50` },
                  { name: t('googleCalendar'), desc: t('googleCalendarDescription'), color: theme.secondary, hoverColor: `${theme.secondary}50` },
                  { name: t('advisorDashboard'), desc: t('advisorDashboardDescription'), color: '#F59E0B', hoverColor: 'rgba(245,158,11,0.5)' },
                ].map((int, index) => (
                  <div key={int.name} className="rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-fade-in delay-100"
                    style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = int.hoverColor)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = theme.border)}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-110 hover:rotate-5" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                      <Plug size={24} color={int.color} className="transition-transform duration-300 hover:rotate-12" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{int.name}</h4>
                    <p className="text-xs transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{int.desc}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden transition-all duration-500 hover:shadow-2xl animate-fade-in"
              style={{ background: `linear-gradient(135deg, ${theme.primary}20, ${theme.surface}, ${theme.accent}10)`, border: `1px solid ${theme.border}` }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none transition-all duration-700 hover:scale-125" style={{ background: `${theme.primary}15`, filter: 'blur(60px)' }} />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 pointer-events-none transition-all duration-700 hover:scale-125" style={{ background: `${theme.accent}10`, filter: 'blur(60px)' }} />
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 transition-all duration-300 hover:scale-105" style={{ color: theme.primary }}>立即开始</p>
              <h2 className="font-bold text-4xl sm:text-5xl tracking-tight mb-6 transition-all duration-300 hover:text-white" style={{ color: theme.text }}>{t('ctaTitle')}</h2>
              <p className="max-w-lg mx-auto mb-10 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('ctaDescription')}</p>
              <button
                  onClick={() => isAuthenticated ? navigate('dashboard') : handleAuth('register')}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 mx-auto group"
                  style={{ background: theme.primary, color: 'white', boxShadow: `0 10px 15px -3px ${theme.primary}30` }}>
                  <Zap size={18} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  {t('startStudysync')}
                </button>
                <p className="text-xs mt-4 transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('ctaSubtitle')}</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 hover:bg-opacity-90" style={{ borderTop: `1px solid ${theme.border}` }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-4 transition-all duration-300 hover:scale-105">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 hover:rotate-5" style={{ background: theme.primary }}>
                    <BookOpen size={14} color="white" className="transition-transform duration-300 hover:rotate-12" />
                  </div>
                  <span className="font-bold transition-all duration-300 hover:text-white" style={{ color: theme.text }}>StudySync</span>
                </div>
                <p className="text-xs leading-relaxed transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('footerDescription')}</p>
              </div>
              {
                [
                  { title: t('product'), links: [t('features'), t('integrations'), t('pricing'), t('changelog')] },
                  { title: t('forStudents'), links: [t('undergraduates'), t('graduates'), t('academicAdvisors'), t('universities')] },
                  { title: t('company'), links: [t('aboutUs'), t('blog'), t('privacyPolicy'), t('termsOfService')] },
                ].map(col => (
                  <div key={col.title}>
                    <h5 className="text-xs font-semibold uppercase tracking-widest mb-4 transition-all duration-300 hover:text-white" style={{ color: theme.textSecondary }}>{col.title}</h5>
                    <ul className="space-y-2">
                      {col.links.map(l => (
                        <li key={l}><a href="#" className="text-sm transition-all duration-300 hover:translate-x-1 hover:text-white" style={{ color: theme.textSecondary }}>{l}</a></li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 transition-all duration-300 hover:border-color-rgba(79,70,229,0.5)" style={{ borderTop: `1px solid ${theme.border}` }}>
              <p className="text-xs transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('copyright')}</p>
              <p className="text-xs transition-all duration-300 hover:opacity-90" style={{ color: theme.textSecondary }}>{t('designedFor')}</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // App Shell with sidebar navigation
  return (
    <div className="min-h-screen flex" style={{ background: theme.background, color: theme.text, fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      <Toaster />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ width: 240, background: theme.surface, borderRight: `1px solid ${theme.border}`, minHeight: '100vh' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.primary }}>
            <BookOpen size={16} color="white" />
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: theme.text }}>StudySync</span>
          <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={18} color={theme.textSecondary} />
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
                  background: active ? `${theme.primary}20` : 'transparent',
                  color: active ? theme.primary : theme.textSecondary,
                  border: active ? `1px solid ${theme.primary}30` : '1px solid transparent',
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
            style={{ color: theme.textSecondary, border: `1px solid ${theme.border}` }}>
            <BookOpen size={18} />
            {t('backToLanding')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 sm:px-6 py-4 lg:hidden" style={{ borderBottom: `1px solid ${theme.border}`, background: theme.surface }}>
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={22} color={theme.text} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: theme.primary }}>
              <BookOpen size={14} color="white" />
            </div>
            <span className="font-bold text-sm" style={{ color: theme.text }}>StudySync</span>
          </div>
          <span className="ml-auto text-sm font-medium" style={{ color: theme.textSecondary }}>
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
    </div>
  );
}
