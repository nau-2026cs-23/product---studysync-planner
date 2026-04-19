import * as React from "react"
import { Link, useLocation } from 'react-router-dom'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import {
  BookOpen,
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Lock,
  Moon,
  Settings,
  Sun,
  Tag,
  User,
  Users,
  Book,
  Bookmark,
  FileClock,
  FilePlus,
  Folder,
  Inbox,
  Trash2,
  Zap,
  Filter,
  Upload,
} from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { t, language, setLanguage } = useLanguage()
  const { logout, user } = useAuth()
  const [sidebarHidden, setSidebarHidden] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(new Date())

  const isActive = (path: string) => {
    return location.pathname.includes(path)
  }

  // 定期更新时间
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 点击别处自动隐藏侧边栏
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebarHidden) {
        const sidebar = document.querySelector('[data-sidebar]');
        const sidebarTrigger = document.querySelector('[data-sidebar-trigger]');
        const closeButton = document.querySelector('[data-sidebar-close]');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            sidebarTrigger && !sidebarTrigger.contains(event.target as Node) &&
            closeButton && !closeButton.contains(event.target as Node)) {
          setSidebarHidden(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarHidden]);

  return (
    <SidebarProvider>
      <div className="flex h-svh w-full relative">
        {!sidebarHidden && (
          <Sidebar collapsible="icon" data-sidebar className="z-10">
            <SidebarContent className="flex flex-col justify-between">
              <div className="space-y-8">
                <div className="px-4 py-6 flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">StudySync</h1>
                  <button
                    onClick={() => setSidebarHidden(!sidebarHidden)}
                    className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-lg font-bold"
                    style={{ minWidth: '32px', textAlign: 'center' }}
                    data-sidebar-close
                  >
                    ×
                  </button>
                </div>
                
                <SidebarGroup>
                  <SidebarGroupLabel>{t('notes') || 'NOTES'}</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard">
                          <LayoutDashboard className="h-4 w-4" />
                          <span>{t('dashboard') || 'Dashboard'}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/vault">
                          <Folder className="h-4 w-4" />
                          <span>Vault</span>
                          <SidebarMenuBadge className="bg-green-500 text-white">1</SidebarMenuBadge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/drafts">
                          <FilePlus className="h-4 w-4" />
                          <span>Drafts</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/recent">
                          <FileClock className="h-4 w-4" />
                          <span>Recent</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/deleted">
                          <Trash2 className="h-4 w-4" />
                          <span>Recently Deleted</span>
                          <SidebarMenuBadge className="bg-gray-400 text-white">0</SidebarMenuBadge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>{t('library') || 'LIBRARY'}</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/subjects">
                          <Book className="h-4 w-4" />
                          <span>Subjects</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/tags">
                          <Tag className="h-4 w-4" />
                          <span>{t('tags') || 'Tags'}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/semesters">
                          <GraduationCap className="h-4 w-4" />
                          <span>Semesters</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>{t('study') || 'STUDY'}</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/ai">
                          <BookOpen className="h-4 w-4" />
                          <span>Study AI</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/focus">
                          <Zap className="h-4 w-4" />
                          <span>Focus Mode</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/flashcards">
                          <CreditCard className="h-4 w-4" />
                          <span>{t('flashcards') || 'Flashcards'}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/schedule">
                          <CalendarDays className="h-4 w-4" />
                          <span>{t('schedule') || 'Schedule'}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                  </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>{t('account') || 'ACCOUNT'}</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/templates">
                          <FileText className="h-4 w-4" />
                          <span>Templates</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)}>
                        <Link to="/dashboard/settings">
                          <Settings className="h-4 w-4" />
                          <span>{t('settings') || 'Settings'}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </div>
              
              <SidebarFooter className="border-t p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="h-4 w-4" />
                    <span>{language === 'en' ? '中文' : 'English'}</span>
                  </button>
                  
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-destructive"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </SidebarFooter>
            </SidebarContent>
          </Sidebar>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden z-0">
          <header className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {sidebarHidden && (
                <button
                  onClick={() => setSidebarHidden(!sidebarHidden)}
                  className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-lg font-bold"
                  style={{ minWidth: '32px', textAlign: 'center', zIndex: 10 }}
                >
                  ☰
                </button>
              )}
              {!sidebarHidden && <SidebarTrigger data-sidebar-trigger />}
              <h1 className="text-xl font-semibold">
                {location.pathname.includes('/dashboard/schedule') && 'Schedule'}
                {location.pathname.includes('/dashboard/progress') && 'Progress'}
                {location.pathname.includes('/dashboard/collab') && 'Collab'}
                {location.pathname.includes('/dashboard/gpa') && 'GPA'}
                {location.pathname.includes('/dashboard/pdf') && 'PDF Import'}
                {location.pathname.includes('/dashboard/tags') && 'Smart Tags'}
                {location.pathname.includes('/dashboard/flashcards') && 'Flashcards'}
                {location.pathname.includes('/dashboard/ai') && 'Study AI'}
                {location.pathname.includes('/dashboard/settings') && 'Settings'}
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname.includes('/dashboard/vault') && 'Vault'}
                {location.pathname.includes('/dashboard/drafts') && 'Drafts'}
                {location.pathname.includes('/dashboard/recent') && 'Recent'}
                {location.pathname.includes('/dashboard/deleted') && 'Recently Deleted'}
                {location.pathname.includes('/dashboard/subjects') && 'Subjects'}
                {location.pathname.includes('/dashboard/semesters') && 'Semesters'}
                {location.pathname.includes('/dashboard/focus') && 'Focus Mode'}
                {location.pathname.includes('/dashboard/templates') && 'Templates'}
                {location.pathname.includes('/dashboard/import') && 'Import'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
                <br />
                {currentTime.toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
