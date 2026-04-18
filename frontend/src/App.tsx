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
            <AISummaryComponent />
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
