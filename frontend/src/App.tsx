import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Index from './pages/Index';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AuthForm from './components/auth/AuthForm';
import { Layout } from './components/Layout';
import DashboardView from './components/custom/DashboardView';
import ScheduleView from './components/custom/ScheduleView';
import ProgressView from './components/custom/ProgressView';
import CollabView from './components/custom/CollabView';
import GpaView from './components/custom/GpaView';
import IntegrationsView from './components/custom/IntegrationsView';
import PDFImportComponent from './components/pdf/PDFImportComponent';
import SmartTagsComponent from './components/tags/SmartTagsComponent';
import FlashcardsComponent from './components/flashcards/FlashcardsComponent';
import AISummaryComponent from './components/ai/AISummaryComponent';
import SettingsView from './components/custom/SettingsView';
import ImportComponent from './components/imports/ImportComponent';
import VaultView from './components/custom/VaultView';
import DraftsView from './components/custom/DraftsView';
import RecentView from './components/custom/RecentView';
import RecentlyDeletedView from './components/custom/RecentlyDeletedView';
import SubjectsView from './components/custom/SubjectsView';
import FocusModeView from './components/custom/FocusModeView';
import SemestersView from './components/custom/SemestersView';
import StudyAIView from './components/custom/StudyAIView';
import TemplatesView from './components/custom/TemplatesView';
import SubjectDetailView from './components/custom/SubjectDetailView';
import SemesterDetailView from './components/custom/SemesterDetailView';
import type { AppView } from './types';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated === null) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const AppContent = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: AppView) => {
    navigate(`/dashboard/${view}`);
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthForm onBack={() => { window.location.href = '/#' }} />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardView onNavigate={handleNavigate} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/schedule" 
        element={
          <ProtectedRoute>
            <ScheduleView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/progress" 
        element={
          <ProtectedRoute>
            <ProgressView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/collab" 
        element={
          <ProtectedRoute>
            <CollabView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/gpa" 
        element={
          <ProtectedRoute>
            <GpaView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/integrations" 
        element={
          <ProtectedRoute>
            <IntegrationsView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/pdf" 
        element={
          <ProtectedRoute>
            <PDFImportComponent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/tags" 
        element={
          <ProtectedRoute>
            <SmartTagsComponent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/flashcards" 
        element={
          <ProtectedRoute>
            <FlashcardsComponent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/ai" 
        element={
          <ProtectedRoute>
            <StudyAIView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/settings" 
        element={
          <ProtectedRoute>
            <SettingsView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/vault" 
        element={
          <ProtectedRoute>
            <VaultView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/drafts" 
        element={
          <ProtectedRoute>
            <DraftsView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/recent" 
        element={
          <ProtectedRoute>
            <RecentView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/deleted" 
        element={
          <ProtectedRoute>
            <RecentlyDeletedView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/subjects" 
        element={
          <ProtectedRoute>
            <SubjectsView onNavigate={handleNavigate} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/subjects/:id" 
        element={
          <ProtectedRoute>
            <SubjectDetailView onNavigate={handleNavigate} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/semesters" 
        element={
          <ProtectedRoute>
            <SemestersView onNavigate={handleNavigate} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/semesters/:id" 
        element={
          <ProtectedRoute>
            <SemesterDetailView onNavigate={handleNavigate} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/focus" 
        element={
          <ProtectedRoute>
            <FocusModeView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/import" 
        element={
          <ProtectedRoute>
            <ImportComponent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/templates" 
        element={
          <ProtectedRoute>
            <TemplatesView onNavigate={handleNavigate} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

const App = () => (
  <LanguageProvider>
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  </LanguageProvider>
);

export default App;
