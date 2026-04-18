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
} from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { t, language, setLanguage } = useLanguage()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return location.pathname.includes(path)
  }

  return (
    <SidebarProvider>
      <div className="flex h-svh w-full">
        <Sidebar collapsible="icon">
          <SidebarContent className="flex flex-col justify-between">
            <div className="space-y-8">
              <div className="px-4 py-6">
                <h1 className="text-2xl font-bold text-foreground">StudySync</h1>
              </div>
              
              <SidebarGroup>
                <SidebarGroupLabel>{t('notes') || 'NOTES'}</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>{t('dashboard') || 'Dashboard'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/schedule">
                        <CalendarDays className="h-4 w-4" />
                        <span>{t('schedule') || 'Schedule'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/progress">
                        <Clock className="h-4 w-4" />
                        <span>{t('progress') || 'Progress'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>{t('library') || 'LIBRARY'}</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/tags">
                        <Tag className="h-4 w-4" />
                        <span>{t('tags') || 'Tags'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/pdf">
                        <FileText className="h-4 w-4" />
                        <span>{t('pdfImport') || 'PDF Import'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/flashcards">
                        <CreditCard className="h-4 w-4" />
                        <span>{t('flashcards') || 'Flashcards'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>{t('study') || 'STUDY'}</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/ai">
                        <BookOpen className="h-4 w-4" />
                        <span>{t('studyAI') || 'Study AI'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/collab">
                        <Users className="h-4 w-4" />
                        <span>{t('collab') || 'Collab'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/gpa">
                        <GraduationCap className="h-4 w-4" />
                        <span>{t('gpa') || 'GPA'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>{t('account') || 'ACCOUNT'}</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
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
                    U
                  </div>
                  <div>
                    <p className="text-sm font-medium">User</p>
                    <p className="text-xs text-muted-foreground">user@example.com</p>
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
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
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
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
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
