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
    background: '#0D1117',
    surface: '#131929',
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    border: '#21262D',
    accent: '#58A6FF',
  },
  light: {
    primary: '#4F46E5',
    secondary: '#10B981',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    accent: '#58A6FF',
  },
  dark: {
    primary: '#8B5CF6',
    secondary: '#10B981',
    background: '#0B0F1A',
    surface: '#131929',
    text: '#F1F5F9',
    textSecondary: '#64748B',
    border: '#1E2D45',
    accent: '#0EA5E9',
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
