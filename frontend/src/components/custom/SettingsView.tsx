import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import {
  User,
  Settings,
  Moon,
  Sun,
  Shield,
  LogOut,
  Trash2,
  Camera,
  X,
} from 'lucide-react';

export default function SettingsView() {
  const { logout } = useAuth();
  const { themeName, setThemeName } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const [profile, setProfile] = useState({
    name: 'User',
    email: 'user@example.com',
  });
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // 这里应该调用API更新用户资料
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // 这里应该调用API更新密码
      toast.success('Password changed successfully');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      // 这里应该调用API删除账户
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, preferences, and account settings</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Settings className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="editor">
            <Settings className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="account">
            <Shield className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white font-medium text-xl">
                    {profile.name.charAt(0) || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="secondary" className="w-fit">
                    Change photo
                  </Button>
                  <Button variant="destructive" className="w-fit">
                    <X className="h-4 w-4 mr-2" />
                    Remove photo
                  </Button>
                  <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF · max 5MB</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  {profile.name.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Theme</h3>
                <RadioGroup 
                  value={themeName} 
                  onValueChange={setThemeName}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex-1">
                      <div className="font-medium">Light</div>
                      <div className="text-sm text-muted-foreground">Clean white interface</div>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex-1">
                      <div className="font-medium">Dark</div>
                      <div className="text-sm text-muted-foreground">Easy on the eyes</div>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex-1">
                      <div className="font-medium">System</div>
                      <div className="text-sm text-muted-foreground">Follow system settings</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Language</h3>
                <div className="flex gap-2">
                  <Button 
                    variant={language === 'en' ? 'default' : 'secondary'}
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                  <Button 
                    variant={language === 'zh' ? 'default' : 'secondary'}
                    onClick={() => setLanguage('zh')}
                  >
                    中文
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Auto-save Interval</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Off</span>
                    <span className="text-sm">120s (slower)</span>
                  </div>
                  <Slider
                    value={[autoSaveInterval]}
                    min={0}
                    max={120}
                    step={5}
                    onValueChange={(value) => setAutoSaveInterval(value[0])}
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {autoSaveInterval === 0 ? 'Off' : `Every ${autoSaveInterval}s`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Security</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your current password"
                  />
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                  <Button onClick={handleChangePassword} disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
