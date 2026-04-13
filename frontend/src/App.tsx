import { HashRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AuthForm from './components/auth/AuthForm';

const App = () => (
  <LanguageProvider>
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthForm onBack={() => { window.location.href = '/#' }} />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  </LanguageProvider>
);

export default App;
