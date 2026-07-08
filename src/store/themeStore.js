import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark';
          // Apply/remove 'light' class on <html> element
          document.documentElement.classList.toggle('light', next === 'light');
          return { theme: next };
        }),

      initTheme: (theme) => {
        document.documentElement.classList.toggle('light', theme === 'light');
      },
    }),
    {
      name: 'vulnsploit-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
