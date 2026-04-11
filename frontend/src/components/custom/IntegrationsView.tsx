import { useState } from 'react';
import { toast } from 'sonner';
import {
  Plug, CheckCircle2, RefreshCw, ExternalLink, Download,
  BookOpen, Calendar, Users, AlertCircle, Zap, X,
} from 'lucide-react';
import { createDeadline, createSession } from '@/lib/api';

interface Integration {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync?: string;
  features: string[];
}

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'canvas',
    name: 'Canvas LMS',
    description: 'Auto-sync assignments, quizzes, and exam dates from Canvas',
    color: '#4F46E5',
    status: 'disconnected',
    features: ['Assignment deadlines', 'Quiz schedules', 'Exam dates', 'Course materials'],
  },
  {
    id: 'blackboard',
    name: 'Blackboard',
    description: 'Pull course materials and deadline notifications from Blackboard',
    color: '#0EA5E9',
    status: 'disconnected',
    features: ['Course deadlines', 'Assignment notifications', 'Grade updates', 'Discussion boards'],
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Export study blocks alongside personal events',
    color: '#06B6D4',
    status: 'disconnected',
    features: ['Export study sessions', 'Sync deadlines', 'Personal event overlay', 'Reminders'],
  },
  {
    id: 'advisor',
    name: 'Advisor Dashboard',
    description: 'Allow academic advisors to monitor your progress and identify at-risk patterns',
    color: '#10B981',
    status: 'disconnected',
    features: ['Progress visibility', 'At-risk alerts', 'Study pattern analysis', 'Intervention triggers'],
  },
];

const SAMPLE_CANVAS_DEADLINES = [
  { title: 'Calculus III - Problem Set 7', dueDate: '2026-03-20', type: 'assignment', priority: 'high', source: 'canvas' },
  { title: 'Organic Chemistry Midterm', dueDate: '2026-03-17', type: 'exam', priority: 'urgent', source: 'canvas' },
  { title: 'CS Data Structures Project', dueDate: '2026-03-28', type: 'project', priority: 'medium', source: 'canvas' },
];

const SAMPLE_SESSIONS_EXPORT = [
  { title: 'Calculus III Study Block', date: '2026-03-15', startTime: '09:00', endTime: '11:00', durationHours: '2', type: 'study' },
  { title: 'Organic Chemistry Review', date: '2026-03-16', startTime: '14:00', endTime: '15:30', durationHours: '1.5', type: 'review' },
];

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [showConnectModal, setShowConnectModal] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  function getIntegration(id: string) {
    return integrations.find(i => i.id === id);
  }

  async function handleConnect(id: string) {
    if (!apiKey.trim()) return toast.error('Please enter your API key or URL');
    setConnecting(true);
    // Simulate connection
    await new Promise(r => setTimeout(r, 1500));
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected', lastSync: new Date().toLocaleString() } : i));
    setShowConnectModal(null);
    setApiKey('');
    setConnecting(false);
    toast.success(`${getIntegration(id)?.name} connected!`, { description: 'Your data will sync automatically.' });
  }

  async function handleSync(id: string) {
    const integration = getIntegration(id);
    if (integration?.status !== 'connected') return toast.error('Connect the integration first');
    setSyncing(id);
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'syncing' } : i));

    try {
      if (id === 'canvas' || id === 'blackboard') {
        // Import sample deadlines
        for (const dl of SAMPLE_CANVAS_DEADLINES) {
          await createDeadline(dl);
        }
        toast.success(`Synced ${SAMPLE_CANVAS_DEADLINES.length} deadlines from ${integration.name}!`);
      } else if (id === 'google_calendar') {
        // Export sample sessions
        for (const s of SAMPLE_SESSIONS_EXPORT) {
          await createSession({ ...s, aiRecommended: false, completed: false });
        }
        toast.success('Study sessions exported to Google Calendar!');
      } else if (id === 'advisor') {
        toast.success('Progress report shared with your advisor!');
      }
    } catch {
      toast.error('Sync failed. Please try again.');
    }

    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected', lastSync: new Date().toLocaleString() } : i));
    setSyncing(null);
  }

  function handleDisconnect(id: string) {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'disconnected', lastSync: undefined } : i));
    toast.success('Integration disconnected');
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Connect your LMS and calendar tools for seamless academic sync</p>
      </div>

      {/* Status Banner */}
      <div className="rounded-2xl p-4 mb-6 flex items-center gap-4" style={{ background: connectedCount > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)', border: `1px solid ${connectedCount > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(79,70,229,0.3)'}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: connectedCount > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(79,70,229,0.2)' }}>
          <Plug size={20} color={connectedCount > 0 ? '#10B981' : '#4F46E5'} />
        </div>
        <div>
          <p className="font-semibold text-sm">{connectedCount > 0 ? `${connectedCount} integration${connectedCount > 1 ? 's' : ''} active` : 'No integrations connected'}</p>
          <p className="text-xs" style={{ color: '#64748B' }}>{connectedCount > 0 ? 'Your academic data is syncing automatically' : 'Connect Canvas, Blackboard, or Google Calendar to get started'}</p>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {integrations.map(integration => (
          <div key={integration.id} className="rounded-2xl p-5" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${integration.color}20`, border: `1px solid ${integration.color}30` }}>
                  <Plug size={22} color={integration.color} />
                </div>
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                      background: integration.status === 'connected' ? '#10B981' : integration.status === 'syncing' ? '#F59E0B' : '#64748B',
                    }} />
                    <span className="text-xs" style={{ color: '#64748B' }}>
                      {integration.status === 'connected' ? 'Connected' : integration.status === 'syncing' ? 'Syncing...' : 'Not connected'}
                    </span>
                  </div>
                </div>
              </div>
              {integration.status === 'connected' && (
                <CheckCircle2 size={20} color="#10B981" className="flex-shrink-0" />
              )}
            </div>

            <p className="text-sm mb-4" style={{ color: '#64748B' }}>{integration.description}</p>

            <div className="mb-4">
              <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>FEATURES</p>
              <div className="grid grid-cols-2 gap-1">
                {integration.features.map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} color={integration.status === 'connected' ? integration.color : '#1E2D45'} />
                    <span className="text-xs" style={{ color: integration.status === 'connected' ? '#F1F5F9' : '#64748B' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {integration.lastSync && (
              <p className="text-xs mb-3" style={{ color: '#64748B' }}>Last sync: {integration.lastSync}</p>
            )}

            <div className="flex gap-2">
              {integration.status === 'disconnected' ? (
                <button onClick={() => setShowConnectModal(integration.id)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: integration.color, color: 'white' }}>
                  Connect
                </button>
              ) : (
                <>
                  <button onClick={() => handleSync(integration.id)}
                    disabled={syncing === integration.id}
                    className="flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: `${integration.color}20`, color: integration.color, border: `1px solid ${integration.color}30`, opacity: syncing === integration.id ? 0.7 : 1 }}>
                    <RefreshCw size={14} className={syncing === integration.id ? 'animate-spin' : ''} />
                    {syncing === integration.id ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button onClick={() => handleDisconnect(integration.id)}
                    className="px-3 py-2 rounded-xl text-sm transition-all"
                    style={{ border: '1px solid #1E2D45', color: '#64748B' }}>
                    Disconnect
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} color="#4F46E5" />
          How Integrations Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, color: '#4F46E5', title: 'Connect LMS', desc: 'Link your Canvas or Blackboard account using your API key or institution URL.' },
            { icon: RefreshCw, color: '#06B6D4', title: 'Auto-Sync', desc: 'Deadlines, assignments, and exam dates are automatically imported into your schedule.' },
            { icon: Calendar, color: '#10B981', title: 'Export & Share', desc: 'Push your study plan to Google Calendar and share progress with your academic advisor.' },
          ].map(step => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${step.color}20` }}>
                  <Icon size={18} color={step.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{step.title}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Connect {getIntegration(showConnectModal)?.name}</h3>
              <button onClick={() => { setShowConnectModal(null); setApiKey(''); }}><X size={20} color="#64748B" /></button>
            </div>
            <div className="rounded-xl p-3 mb-4 flex items-start gap-2" style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)' }}>
              <AlertCircle size={16} color="#4F46E5" className="flex-shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: '#64748B' }}>This is a demo integration. In production, you would authenticate with your institution credentials.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>
                  {showConnectModal === 'google_calendar' ? 'Google Account Email' : 'API Key or Institution URL'}
                </label>
                <input
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={showConnectModal === 'google_calendar' ? 'your@gmail.com' : 'https://canvas.university.edu or API key'}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}
                />
              </div>
              {showConnectModal === 'advisor' && (
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>Advisor Email</label>
                  <input placeholder="advisor@university.edu"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }} />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowConnectModal(null); setApiKey(''); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}>Cancel</button>
              <button onClick={() => handleConnect(showConnectModal)} disabled={connecting}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: getIntegration(showConnectModal)?.color || '#4F46E5', color: 'white', opacity: connecting ? 0.7 : 1 }}>
                {connecting ? <><RefreshCw size={14} className="animate-spin" /> Connecting...</> : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
