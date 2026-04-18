import { useEffect, useState } from 'react';
import { getIntegrations, createIntegration, deleteIntegration } from '@/lib/api';
import type { Integration } from '@/types';
import { toast } from 'sonner';
import { Zap, Plus, Trash2, CheckCircle2, Link2, RefreshCw, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const INTEGRATION_CATEGORIES = [
  {
    name: 'Productivity',
    integrations: [
      { name: 'Notion', description: 'Sync notes with your Notion workspace', icon: '📝', color: '#000000' },
      { name: 'Obsidian', description: 'Link your vault for seamless笔记管理', icon: '🔮', color: '#7C3AED' },
      { name: 'Evernote', description: 'Import and organize your Evernote notes', icon: '🗒️', color: '#00A82D' },
    ],
  },
  {
    name: 'Calendar',
    integrations: [
      { name: 'Google Calendar', description: 'Sync study sessions with your calendar', icon: '📅', color: '#4285F4' },
      { name: 'Apple Calendar', description: 'Import events from Apple Calendar', icon: '🍎', color: '#A2AAAD' },
      { name: 'Outlook', description: 'Connect with Microsoft Outlook calendar', icon: '📤', color: '#0078D4' },
    ],
  },
  {
    name: 'AI & Tools',
    integrations: [
      { name: 'OpenAI', description: 'Power your笔记with GPT models', icon: '🤖', color: '#10A37F' },
      { name: 'Anthropic Claude', description: 'Get AI assistance for studying', icon: '🧠', color: '#CC785C' },
      { name: 'Wolfram Alpha', description: 'Compute answers and visualizations', icon: '🔢', color: '#DD00FF' },
    ],
  },
];

const CONNECTED_INTEGRATIONS_KEY = 'connectedIntegrations';

export default function IntegrationsView() {
  const { t } = useLanguage();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<{ name: string; icon: string; color: string } | null>(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getIntegrations();
        if (cancelled) return;
        if (res.success) setIntegrations(res.data);
      } catch {
        if (!cancelled) toast.error(t('failedToLoadIntegrations'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  async function handleConnect(integration: { name: string; icon: string; color: string }) {
    setSelectedIntegration(integration);
    setShowConnectModal(true);
  }

  async function confirmConnect() {
    if (!selectedIntegration || !apiKey.trim()) return toast.error(t('apiKeyRequired'));

    setConnecting(selectedIntegration.name);
    setShowConnectModal(false);

    await new Promise(r => setTimeout(r, 1500));

    try {
      const newIntegration: Integration = {
        id: `int_${Date.now()}`,
        userId: 'current_user',
        type: selectedIntegration.name.toLowerCase().replace(/\s+/g, '_'),
        name: selectedIntegration.name,
        status: 'active',
        apiKey: apiKey,
        settings: {},
        createdAt: new Date().toISOString(),
      };

      const res = await createIntegration(newIntegration);
      if (res.success) {
        setIntegrations(prev => [...prev, res.data]);
        const saved = JSON.parse(localStorage.getItem(CONNECTED_INTEGRATIONS_KEY) || '[]');
        localStorage.setItem(CONNECTED_INTEGRATIONS_KEY, JSON.stringify([...saved, selectedIntegration.name]));
        toast.success(t('integrationConnected', { name: selectedIntegration.name }));
      }
    } catch {
      toast.error(t('failedToConnectIntegration'));
    } finally {
      setConnecting(null);
      setApiKey('');
      setSelectedIntegration(null);
    }
  }

  async function handleDisconnect(id: string) {
    try {
      await deleteIntegration(id);
      setIntegrations(prev => prev.filter(i => i.id !== id));
      const saved = JSON.parse(localStorage.getItem(CONNECTED_INTEGRATIONS_KEY) || '[]');
      localStorage.setItem(CONNECTED_INTEGRATIONS_KEY, JSON.stringify(saved.filter((n: string) => n !== id)));
      toast.success(t('integrationDisconnected'));
    } catch {
      toast.error(t('failedToDisconnectIntegration'));
    }
  }

  async function handleRefresh(id: string) {
    try {
      toast.success(t('integrationRefreshed'));
    } catch {
      toast.error(t('failedToRefreshIntegration'));
    }
  }

  const connectedNames = integrations.map(i => i.name);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#4F46E5', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('integrations')}</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{t('integrationsDescription')}</p>
      </div>

      {integrations.length > 0 && (
        <>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} color="#10B981" />
            {t('connectedIntegrations')} ({integrations.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {integrations.map(integration => (
              <div key={integration.id} className="rounded-xl p-4 flex items-center gap-3" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(79,70,229,0.1)' }}>
                  {integration.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{integration.name}</p>
                  <p className="text-xs" style={{ color: '#10B981' }}>{t('connected')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleRefresh(integration.id)}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                    style={{ color: '#6B7280' }} title={t('refresh')}>
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={() => handleDisconnect(integration.id)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#6B7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                    title={t('disconnect')}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="font-semibold mb-3">{t('availableIntegrations')}</h2>
      <div className="space-y-6">
        {INTEGRATION_CATEGORIES.map(category => (
          <div key={category.name}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#6B7280' }}>{category.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.integrations.map(integration => {
                const isConnected = connectedNames.includes(integration.name);
                const isConnecting = connecting === integration.name;
                return (
                  <div key={integration.name} className="rounded-xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${integration.color}15` }}>
                        {integration.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{integration.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{integration.description}</p>
                      </div>
                    </div>
                    {isConnecting ? (
                      <div className="flex items-center justify-center gap-2 py-2 rounded-lg" style={{ background: 'rgba(79,70,229,0.1)' }}>
                        <RefreshCw size={14} className="animate-spin" color="#4F46E5" />
                        <span className="text-xs" style={{ color: '#4F46E5' }}>{t('connecting')}...</span>
                      </div>
                    ) : isConnected ? (
                      <div className="flex items-center justify-center gap-2 py-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)' }}>
                        <CheckCircle2 size={14} color="#10B981" />
                        <span className="text-xs" style={{ color: '#10B981' }}>{t('connected')}</span>
                      </div>
                    ) : (
                      <button onClick={() => handleConnect(integration)}
                        className="w-full py-2 rounded-lg text-xs font-medium transition-all"
                        style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.2)' }}>
                        <Plus size={12} className="inline mr-1" /> {t('connect')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.1)' }}>
        <Zap size={24} color="#4F46E5" className="mx-auto mb-2" />
        <h3 className="font-semibold mb-1">{t('wantMoreIntegrations')}</h3>
        <p className="text-xs" style={{ color: '#6B7280' }}>{t('integrationRequestDescription')}</p>
        <a href="mailto:integrations@studysync.app"
          className="inline-flex items-center gap-1 mt-3 text-xs px-4 py-2 rounded-lg transition-all"
          style={{ background: '#4F46E5', color: 'white' }}>
          {t('requestIntegration')} <ExternalLink size={10} />
        </a>
      </div>

      {showConnectModal && selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg" style={{ color: '#111827' }}>
                {t('connect')} {selectedIntegration.name}
              </h3>
              <button onClick={() => { setShowConnectModal(false); setApiKey(''); }}
                style={{ color: '#6B7280' }}>
                ✕
              </button>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${selectedIntegration.color}15` }}>
                  {selectedIntegration.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{selectedIntegration.name}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{t('apiKeyRequired')}</p>
                </div>
              </div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B7280' }}>
                API Key
              </label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                placeholder={t('enterApiKey')}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', color: '#111827' }} />
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                {t('apiKeySecurityNote')}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowConnectModal(false); setApiKey(''); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
                {t('cancel')}
              </button>
              <button onClick={confirmConnect}
                disabled={!apiKey.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white', opacity: !apiKey.trim() ? 0.6 : 1 }}>
                {t('connect')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}