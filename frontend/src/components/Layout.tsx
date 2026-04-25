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
  Search,
} from "lucide-react"
import SearchComponent from "@/components/search/SearchComponent"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { t, language, setLanguage } = useLanguage()
  const { logout, user } = useAuth()
  const [sidebarHidden, setSidebarHidden] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const [deletedCount, setDeletedCount] = React.useState(0)

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

  // 监听最近删除的项目数量
  React.useEffect(() => {
    const updateDeletedCount = () => {
      const saved = localStorage.getItem('recentlyDeleted')
      if (saved) {
        const deletedItems = JSON.parse(saved)
        setDeletedCount(deletedItems.length)
      }
    }

    // 初始更新
    updateDeletedCount()

    // 监听localStorage变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'recentlyDeleted') {
        updateDeletedCount()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
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
                    className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-lg font-bold transition-all duration-200"
                    style={{ minWidth: '32px', textAlign: 'center' }}
                    data-sidebar-close
                  >
                    ×
                  </button>
                </div>
                
                <SidebarGroup>
                  <SidebarGroupLabel>笔记</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard" className="flex items-center gap-3 w-full">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>仪表盘</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/vault" className="flex items-center gap-3 w-full">
                          <Folder className="h-5 w-5" />
                          <span>保险库</span>
                          <SidebarMenuBadge className="bg-green-500 text-white">1</SidebarMenuBadge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/drafts" className="flex items-center gap-3 w-full">
                          <FilePlus className="h-5 w-5" />
                          <span>草稿</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/recent" className="flex items-center gap-3 w-full">
                          <FileClock className="h-5 w-5" />
                          <span>最近</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/deleted" className="flex items-center gap-3 w-full">
                          <Trash2 className="h-5 w-5" />
                          <span>最近删除</span>
                          {deletedCount > 0 && (
                            <SidebarMenuBadge className="bg-gray-400 text-white">{deletedCount}</SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>资料库</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/subjects" className="flex items-center gap-3 w-full">
                          <Book className="h-5 w-5" />
                          <span>科目</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/tags" className="flex items-center gap-3 w-full">
                          <Tag className="h-5 w-5" />
                          <span>标签</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/semesters" className="flex items-center gap-3 w-full">
                          <GraduationCap className="h-5 w-5" />
                          <span>学期</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/templates" className="flex items-center gap-3 w-full">
                          <FileText className="h-5 w-5" />
                          <span>模板</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>学习</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/ai" className="flex items-center gap-3 w-full">
                          <BookOpen className="h-5 w-5" />
                          <span>学习AI</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/focus" className="flex items-center gap-3 w-full">
                          <Zap className="h-5 w-5" />
                          <span>专注模式</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/flashcards" className="flex items-center gap-3 w-full">
                          <CreditCard className="h-5 w-5" />
                          <span>闪卡</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/schedule" className="flex items-center gap-3 w-full">
                          <CalendarDays className="h-5 w-5" />
                          <span>日程</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                  </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>账户</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => setSidebarHidden(true)} className="transition-all duration-200 hover:bg-accent/50">
                        <Link to="/dashboard/settings" className="flex items-center gap-3 w-full">
                          <Settings className="h-5 w-5" />
                          <span>设置</span>
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
                    <span>退出登录</span>
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
                {location.pathname.includes('/dashboard/schedule') && '日程'}
                {location.pathname.includes('/dashboard/progress') && '进度'}
                {location.pathname.includes('/dashboard/collab') && '协作'}
                {location.pathname.includes('/dashboard/gpa') && 'GPA'}
                {location.pathname.includes('/dashboard/pdf') && 'PDF导入'}
                {location.pathname.includes('/dashboard/tags') && '智能标签'}
                {location.pathname.includes('/dashboard/flashcards') && '闪卡'}
                {location.pathname.includes('/dashboard/ai') && '学习AI'}
                {location.pathname.includes('/dashboard/settings') && '设置'}
                {location.pathname === '/dashboard' && '仪表盘'}
                {location.pathname.includes('/dashboard/vault') && '保险库'}
                {location.pathname.includes('/dashboard/drafts') && '草稿'}
                {location.pathname.includes('/dashboard/recent') && '最近'}
                {location.pathname.includes('/dashboard/deleted') && '最近删除'}
                {location.pathname.includes('/dashboard/semesters/') && location.pathname.split('/').pop() !== 'semesters' && '学期详情'}
                {location.pathname.includes('/dashboard/semesters') && !location.pathname.includes('/semesters/') && '学期'}
                {location.pathname.includes('/dashboard/subjects/') && location.pathname.split('/').pop() !== 'subjects' && '学科详情'}
                {location.pathname.includes('/dashboard/subjects') && !location.pathname.includes('/subjects/') && '科目'}
                {location.pathname.includes('/dashboard/focus') && '专注模式'}
                {location.pathname.includes('/dashboard/import') && '导入'}
                {location.pathname.includes('/dashboard/templates') && '模板'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <SearchComponent 
                onNavigate={(view) => {
                  setSidebarHidden(true);
                  // 根据view导航到相应页面
                  switch (view) {
                    case 'vault':
                      window.location.href = '/dashboard/vault';
                      break;
                    case 'subjects':
                      window.location.href = '/dashboard/subjects';
                      break;
                    case 'semesters':
                      window.location.href = '/dashboard/semesters';
                      break;
                    case 'flashcards':
                      window.location.href = '/dashboard/flashcards';
                      break;
                    case 'tags':
                      window.location.href = '/dashboard/tags';
                      break;
                    default:
                      break;
                  }
                }}
              />
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
