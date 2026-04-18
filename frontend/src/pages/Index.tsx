import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeSelector from '@/components/ui/ThemeSelector';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { Zap, Search, Eye, Lock, Sparkles, FileText, Tags, CreditCard, CheckCircle, ArrowRight, Play } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleAuth = (type: 'login' | 'register') => {
    navigate('/auth');
  };

  const features = [
    { icon: Zap, title: t('instantSync'), description: t('instantSyncDescription'), color: '#4F46E5' },
    { icon: Search, title: t('deepSearch'), description: t('deepSearchDescription'), color: '#06B6D4' },
    { icon: Eye, title: t('focusMode'), description: t('focusModeDescription'), color: '#10B981' },
    { icon: Lock, title: t('privateVault'), description: t('privateVaultDescription'), color: '#F59E0B' },
    { icon: Sparkles, title: t('aiSummaries'), description: t('aiSummariesDescription'), color: '#EC4899' },
    { icon: FileText, title: t('pdfImport'), description: t('pdfImportDescription'), color: '#8B5CF6' },
    { icon: Tags, title: t('smartTags'), description: t('smartTagsDescription'), color: '#0EA5E9' },
    { icon: CreditCard, title: t('flashcards'), description: t('flashcardsDescription'), color: '#EF4444' },
  ];

  const workflow = [
    { step: '01', title: t('capture'), description: t('captureDescription'), icon: '📝' },
    { step: '02', title: t('organize'), description: t('organizeDescription'), icon: '📁' },
    { step: '03', title: t('sync'), description: t('syncDescription'), icon: '🔄' },
  ];

  return (
    <div className="min-h-screen" style={{ background: theme.background, color: theme.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: `${theme.surface}CC`, borderColor: theme.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.primary }}>
                <Zap size={18} color="white" />
              </div>
              <span className="font-bold text-lg">StudySync</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('features')}</a>
              <div className="flex items-center gap-2">
                <ThemeSelector />
                <LanguageSelector />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{ background: theme.primary, color: 'white' }}>
                  {t('dashboard')}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAuth('login')}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                    style={{ color: theme.textSecondary }}>
                    {t('login')}
                  </button>
                  <button
                    onClick={() => handleAuth('register')}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                    style={{ background: theme.primary, color: 'white' }}>
                    {t('signUp')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: `${theme.primary}10`, border: `1px solid ${theme.primary}20` }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }}></div>
            <span className="text-xs font-medium" style={{ color: theme.primary }}>{t('status')}: {t('synced')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
            {t('heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleAuth('register')}
              className="px-8 py-4 rounded-xl text-base font-semibold transition-all hover:scale-105 flex items-center gap-2"
              style={{ background: theme.primary, color: 'white', boxShadow: `0 10px 25px -5px ${theme.primary}40` }}>
              {t('createFreeVault')}
              <ArrowRight size={18} />
            </button>
            <a
              href="#workflow"
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              style={{ color: theme.textSecondary }}>
              <Play size={16} />
              {t('howItWorks')}
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('powerfulCapabilities')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
              {t('capabilitiesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl p-6 transition-all hover:scale-105 cursor-default"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${feature.color}15` }}>
                    <Icon size={24} color={feature.color} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('simpleEfficient')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
              {t('workflowSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflow.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
                <div
                  className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ background: `${theme.primary}15`, color: theme.primary }}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-sm" style={{ color: theme.textSecondary }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: `linear-gradient(135deg, ${theme.primary}08, ${theme.surface})`, border: `1px solid ${theme.border}` }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('ctaTitle')}</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
              {t('ctaDescription')}
            </p>
            <button
              onClick={() => handleAuth('register')}
              className="px-8 py-4 rounded-xl text-base font-semibold transition-all hover:scale-105"
              style={{ background: theme.primary, color: 'white' }}>
              {t('startFree')}
            </button>
            <p className="text-xs mt-4" style={{ color: theme.textSecondary }}>{t('noCreditCard')}</p>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: theme.border }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: theme.primary }}>
                  <Zap size={14} color="white" />
                </div>
                <span className="font-bold">StudySync</span>
              </div>
              <p className="text-xs" style={{ color: theme.textSecondary }}>{t('footerDescription')}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">{t('product')}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('features')}</a></li>
                <li><a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('pricing')}</a></li>
                <li><a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('changelog')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">{t('company')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('aboutUs')}</a></li>
                <li><a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('blog')}</a></li>
                <li><a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('careers')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">{t('legal')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('privacyPolicy')}</a></li>
                <li><a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: theme.textSecondary }}>{t('termsOfService')}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center" style={{ borderColor: theme.border }}>
            <p className="text-xs" style={{ color: theme.textSecondary }}>{t('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;