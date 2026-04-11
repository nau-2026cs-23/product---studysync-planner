import { HashRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { AuthProvider } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';

const App = () => (
  <AuthProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthForm onBack={() => window.location.href = '/' />} />
      </Routes>
    </HashRouter>
  </AuthProvider>
);

export default App;
