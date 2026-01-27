import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

// Icon components using Material Symbols
const SunIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }} aria-hidden="true">
    light_mode
  </span>
);

const MoonIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }} aria-hidden="true">
    dark_mode
  </span>
);

// Safe initialization that works on both server and client
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme());

  // Apply theme to document
  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, []);

  // Apply theme when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  const cycleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  // Get icon for current theme
  const getCurrentIcon = () => {
    return currentTheme === 'dark' ? <MoonIcon /> : <SunIcon />;
  };

  return (
    <button
      onClick={cycleTheme}
      aria-label="Переключить тему"
      className="rounded-full inline-flex items-center justify-center transition-all duration-200 hover:opacity-80 hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        width: '40px',
        height: '40px',
        backgroundColor: 'transparent',
        color: 'var(--color-foreground)',
      }}
    >
      {getCurrentIcon()}
    </button>
  );
}
