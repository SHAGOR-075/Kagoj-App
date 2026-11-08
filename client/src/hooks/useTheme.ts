// Hook for managing light and dark mode with system preference fallback.

import { useEffect, useState } from 'react';
import { getStoredItem, setStoredItem } from '../utils/storage';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = getStoredItem<Theme | null>('kagoj_theme', null);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setStoredItem('kagoj_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, isDark: theme === 'dark', toggleTheme };
}
