import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, ChevronLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthFormProps {
  onBack: () => void;
}

const AuthForm = ({ onBack }: AuthFormProps) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedRemember = localStorage.getItem('rememberMe');

    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedRemember === 'true') {
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('savedEmail');
      localStorage.setItem('rememberMe', 'false');
    }
  }, [email, rememberMe]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (email || password) {
      timeout = setTimeout(() => {
        const formData = { email, password };
        sessionStorage.setItem('authFormData', JSON.stringify(formData));
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [email, password]);

  useEffect(() => {
    const saved = sessionStorage.getItem('authFormData');
    if (saved && activeTab === 'login') {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
        if (!email && !password) {
          setEmail(savedEmail || '');
          setPassword(savedPassword || '');
        }
      } catch {}
    }
  }, [activeTab]);

  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' };

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: t('weakPassword') || '弱', color: '#EF4444' };
    if (score <= 3) return { score, label: t('mediumPassword') || '中', color: '#F59E0B' };
    return { score, label: t('strongPassword') || '强', color: '#10B981' };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    if (passwordsMatch && error === (t('passwordMismatch') || '密码不匹配')) {
      setError('');
    }
  }, [password, confirmPassword, error, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (activeTab === 'register' && password !== confirmPassword) {
      setError(t('passwordMismatch') || '两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort') || '密码长度至少为6位');
      setIsLoading(false);
      return;
    }

    try {
      // 模拟登录，直接成功
      const mockToken = 'mock-token-' + Date.now();
      const mockUser = {
        name: email.split('@')[0],
        email: email
      };
      login(mockToken, mockUser);
      window.location.href = '/#/dashboard';
      sessionStorage.removeItem('authFormData');
    } catch (err) {
      // 即使出错也模拟登录成功
      const mockToken = 'mock-token-' + Date.now();
      const mockUser = {
        name: email.split('@')[0],
        email: email
      };
      login(mockToken, mockUser);
      window.location.href = '/#/dashboard';
      sessionStorage.removeItem('authFormData');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: theme.background }}>
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm transition-colors hover:opacity-70"
          style={{ color: theme.textSecondary }}
        >
          <ChevronLeft size={16} />
          {t('backToLanding') || '返回首页'}
        </button>

        <Card style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === 'login' ? (t('login') || '登录') : (t('signUp') || '注册')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6" style={{ background: theme.background }}>
                <TabsTrigger value="login" style={{ color: activeTab === 'login' ? theme.primary : theme.textSecondary }}>{t('login') || '登录'}</TabsTrigger>
                <TabsTrigger value="register" style={{ color: activeTab === 'register' ? theme.primary : theme.textSecondary }}>{t('signUp') || '注册'}</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="button"
                  className="w-full py-3 mb-4 flex items-center justify-center gap-2"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill="#4285F4"/>
                    <path d="M12 18.25c-3.27 0-6-1.08-6-2.92s2.73-2.92 6-2.92 6 1.08 6 2.92-2.73 2.92-6 2.92z" fill="#34A853"/>
                    <path d="M5.83 14.08a2.34 2.34 0 0 1 0-2.16 2.34 2.34 0 0 1 0 2.16z" fill="#FBBC05"/>
                    <path d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1.25c-3.27 0-6-1.08-6-2.92s2.73-2.92 6-2.92 6 1.08 6 2.92-2.73 2.92-6 2.92z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative flex items-center justify-center mb-4">
                  <div className="absolute w-full h-px bg-gray-300"></div>
                  <div className="relative bg-white px-4 text-sm text-gray-500">OR</div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="email" className="text-sm font-medium mb-1 block" style={{ color: theme.text }}>
                    {t('email') || '邮箱'}
                  </Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('enterEmail') || '请输入您的邮箱'}
                      required
                      className="pl-10"
                      style={{ background: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="password" className="text-sm font-medium mb-1 block" style={{ color: theme.text }}>
                    {t('password') || '密码'}
                  </Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('enterPassword') || '请输入密码'}
                      required
                      className="pl-10 pr-10"
                      style={{ background: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                      style={{ color: theme.textSecondary }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {activeTab === 'register' && password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: theme.textSecondary }}>
                          {t('passwordStrength') || '密码强度'}:
                        </span>
                        <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: theme.border }}>
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            background: passwordStrength.color
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {activeTab === 'register' && (
                  <div className="mb-4">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium mb-1 block" style={{ color: theme.text }}>
                      {t('confirmPassword') || '确认密码'}
                    </Label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('confirmPassword') || '请再次输入密码'}
                        required
                        className="pl-10 pr-10"
                        style={{
                          background: theme.background,
                          borderColor: passwordsDontMatch ? '#EF4444' : passwordsMatch ? '#10B981' : theme.border,
                          color: theme.text
                        }}
                      />
                      {confirmPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {passwordsMatch ? (
                            <CheckCircle2 size={16} color="#10B981" />
                          ) : (
                            <XCircle size={16} color="#EF4444" />
                          )}
                        </div>
                      )}
                    </div>

                    {passwordsDontMatch && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <AlertCircle size={12} color="#EF4444" />
                        <span className="text-xs" style={{ color: '#EF4444' }}>
                          {t('passwordMismatch') || '密码不匹配'}
                        </span>
                      </div>
                    )}

                    {passwordsMatch && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <CheckCircle2 size={12} color="#10B981" />
                        <span className="text-xs" style={{ color: '#10B981' }}>
                          {t('passwordMatch') || '密码匹配'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'login' && (
                  <div className="mb-6 flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm" style={{ color: theme.textSecondary }}>
                      {t('rememberMe') || '记住我'}
                    </label>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || (activeTab === 'register' && passwordsDontMatch)}
                  className="w-full py-3 transition-all"
                  style={{
                    background: (activeTab === 'register' && passwordsDontMatch) ? '#9CA3AF' : '#6366F1',
                    color: 'white',
                    opacity: (activeTab === 'register' && passwordsDontMatch) ? 0.6 : 1
                  }}
                >
                  {isLoading ? (t('processing') || '处理中...') : activeTab === 'login' ? (t('login') || '登录') : (t('signUp') || '注册')}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs mt-6" style={{ color: theme.textSecondary }}>
          © 2026 StudySync. {t('allRightsReserved') || '保留所有权利。'}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;