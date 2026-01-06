import { useEffect, useState, useCallback, useRef } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ReactElement;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Светлая',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Темная',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'Системная',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
  },
];

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Apply theme to document
  const applyTheme = useCallback((theme: Theme) => {
    document.documentElement.classList.remove('light', 'dark');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved = prefersDark ? 'dark' : 'light';
      setResolvedTheme(resolved);
      document.documentElement.classList.add(resolved);
    } else {
      setResolvedTheme(theme);
      document.documentElement.classList.add(theme);
    }
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem('theme') as Theme | null;
    const initialTheme = stored || 'system';
    setCurrentTheme(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (currentTheme === 'system') {
        const prefersDark = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
        const newResolved = prefersDark ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        dropdownRef.current &&
        triggerRef.current &&
        !dropdownRef.current.contains(target) &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Focus first item when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const firstItem = document.getElementById('theme-item-0');
      firstItem?.focus();
    }
  }, [isOpen]);

  const handleThemeSelect = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (index + 1) % themeOptions.length;
        document.getElementById(`theme-item-${nextIndex}`)?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (index + themeOptions.length - 1) % themeOptions.length;
        document.getElementById(`theme-item-${prevIndex}`)?.focus();
        break;
      case 'Home':
        e.preventDefault();
        document.getElementById('theme-item-0')?.focus();
        break;
      case 'End':
        e.preventDefault();
        document.getElementById(`theme-item-${themeOptions.length - 1}`)?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleThemeSelect(themeOptions[index].value);
        break;
    }
  };

  // Get icon for current theme to display on trigger button
  const getCurrentIcon = () => {
    if (currentTheme === 'system') {
      return themeOptions[2].icon;
    }
    return currentTheme === 'dark' ? themeOptions[1].icon : themeOptions[0].icon;
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Загрузка переключателя темы"
        className="rounded-lg inline-flex items-center justify-center"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--color-border)',
        }}
      />
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id="theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Выбрать тему"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="theme-dropdown"
        className="rounded-lg inline-flex items-center justify-center transition-all duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--color-border)',
          color: 'var(--color-foreground)',
        }}
      >
        <div className="flex items-center justify-center">
          {getCurrentIcon()}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="theme-dropdown"
          role="menu"
          aria-labelledby="theme-trigger"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
          }}
        >
          {themeOptions.map((option, index) => {
            const isSelected = currentTheme === option.value;
            return (
              <div
                key={option.value}
                id={`theme-item-${index}`}
                role="menuitemradio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleThemeSelect(option.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors duration-150 focus-visible:outline-none"
                style={{
                  color: 'var(--color-foreground)',
                  backgroundColor: isSelected ? 'var(--color-accent) / 0.1' : 'transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="shrink-0"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {option.icon}
                  </div>
                  <span>{option.label}</span>
                </div>
                {isSelected && (
                  <div
                    className="ml-auto shrink-0"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    <CheckIcon />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
