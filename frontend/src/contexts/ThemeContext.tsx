import { createContext, useState, useContext, ReactNode } from 'react';

interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setThemeName: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = {
  default: {
    primary: '#4F46E5',
    secondary: '#10B981',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    accent: '#6366F1',
  },
  light: {
    primary: '#4F46E5',
    secondary: '#10B981',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    accent: '#6366F1',
  },
  dark: {
    primary: '#6366F1',
    secondary: '#10B981',
    background: '#0B0F19',
    surface: '#131929',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#1E293B',
    accent: '#818CF8',
  },
  blue: {
    primary: '#0EA5E9',
    secondary: '#14B8A6',
    background: '#F0F9FF',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E0F2FE',
    accent: '#38BDF8',
  },
  green: {
    primary: '#10B981',
    secondary: '#059669',
    background: '#ECFDF5',
    surface: '#FFFFFF',
    text: '#065F46',
    textSecondary: '#65A30D',
    border: '#D1FAE5',
    accent: '#34D399',
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    background: '#F5F3FF',
    surface: '#FFFFFF',
    text: '#4C1D95',
    textSecondary: '#7E22CE',
    border: '#EDE9FE',
    accent: '#A78BFA',
  },
  orange: {
    primary: '#F59E0B',
    secondary: '#D97706',
    background: '#FFF7ED',
    surface: '#FFFFFF',
    text: '#92400E',
    textSecondary: '#B45309',
    border: '#FFEDD5',
    accent: '#FBBF24',
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState('default');
  const [theme, setTheme] = useState<Theme>(themes.default);

  const handleSetThemeName = (name: string) => {
    setThemeName(name);
    setTheme(themes[name as keyof typeof themes] || themes.default);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName: handleSetThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
