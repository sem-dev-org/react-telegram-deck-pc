import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  background: string;
  setBackground: (background: string) => void;

  title: string;
  setTitle: (title: string) => void;

  safeAreaInsets: { top: number; bottom: number };
  setSafeAreaInsets: (safeAreaInsets: { top: number; bottom: number }) => void;

  contentSafeAreaInsets: { top: number; bottom: number };
  setContentSafeAreaInsets: (contentSafeAreaInsets: { top: number; bottom: number }) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),

  background: '',
  setBackground: (background) => set({ background }),

  title: 'Betfrom',
  setTitle: (title) => set({ title }),

  safeAreaInsets: { top: 0, bottom: 0 },
  setSafeAreaInsets: (safeAreaInsets) => set({ safeAreaInsets }),

  contentSafeAreaInsets: { top: 52, bottom: 0 },
  setContentSafeAreaInsets: (contentSafeAreaInsets) => set({ contentSafeAreaInsets }),
}));
