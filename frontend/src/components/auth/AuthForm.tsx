import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Phone, Lock, User, ChevronLeft } from 'lucide-react';

interface AuthFormProps {
  onBack: () => void;
}

const AuthForm = ({ onBack }: AuthFormProps) => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = activeTab === 'login' 
        ? { email, phone, password }
        : { name, email, phone, password, confirmPassword };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '认证失败');
      }

      if (activeTab === 'login') {
        login(data.token);
      } else {
        // 注册成功后自动登录
        login(data.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '认证失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0B0F1A' }}>
      <div className="w-full max-w-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          返回首页
        </button>
        
        <Card style={{ background: '#131929', border: '1px solid #1E2D45' }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === 'login' ? '登录' : '注册'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6" style={{ background: '#0B0F1A' }}>
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {activeTab === 'register' && (
                  <div className="mb-4">
                    <Label htmlFor="name" className="text-sm font-medium mb-1 block">
                      姓名
                    </Label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="请输入您的姓名"
                        required
                        className="pl-10 bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <Label htmlFor="email" className="text-sm font-medium mb-1 block">
                    邮箱
                  </Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入您的邮箱"
                      required
                      className="pl-10 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="phone" className="text-sm font-medium mb-1 block">
                    手机号码
                  </Label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="请输入您的手机号码"
                      required
                      className="pl-10 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="password" className="text-sm font-medium mb-1 block">
                    密码
                  </Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                      required
                      className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                {activeTab === 'register' && (
                  <div className="mb-6">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium mb-1 block">
                      确认密码
                    </Label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="请再次输入密码"
                        required
                        className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3" style={{ background: '#4F46E5', color: 'white' }}
                >
                  {isLoading ? '处理中...' : activeTab === 'login' ? '登录' : '注册'}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Omniflow. 保留所有权利。
        </p>
      </div>
    </div>
  );
};

export default AuthForm;