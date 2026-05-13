import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken:     null,
      refreshToken:    null,
      username:        null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken, username = null) =>
        set({ accessToken, refreshToken, username, isAuthenticated: true }),

      logout: () =>
        set({
          accessToken:     null,
          refreshToken:    null,
          username:        null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'vulnsploit-auth',
      partialize: (state) => ({
        accessToken:     state.accessToken,
        refreshToken:    state.refreshToken,
        username:        state.username,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
