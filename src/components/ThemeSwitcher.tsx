import { useEffect, useState, useRef, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

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

const MonitorIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }} aria-hidden="true">
    desktop_windows
  </span>
);

// Safe initialization that works on both server and client
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
};

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme());
  const resolvedTheme = useRef<'light' | 'dark'>('light');

  // Apply theme to document
  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      resolvedTheme.current = resolved;
      root.classList.add(resolved);
    } else {
      resolvedTheme.current = theme;
      root.classList.add(theme);
    }
  }, []);

  // Apply theme when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme, applyTheme]);

  // Cycle to next theme
  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setCurrentTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  // Get icon for current theme
  const getCurrentIcon = () => {
    if (currentTheme === 'system') return <MonitorIcon />;
    return currentTheme === 'dark' ? <MoonIcon /> : <SunIcon />;
  };

  return (
    <button
      onClick={cycleTheme}
      aria-label="Переключить тему: Светлая → Темная → Системная"
      className="rounded-full inline-flex items-center justify-center transition-all duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
