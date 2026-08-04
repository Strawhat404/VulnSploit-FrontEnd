import { create } from 'zustand';

export const useAuthStore = create(
  (set) => ({
    accessToken:     null,
    username:        null,
    isAuthenticated: false,

    setTokens: (accessToken, username = null) =>
      set({ accessToken, username, isAuthenticated: true }),

    logout: () =>
      set({
        accessToken:     null,
        username:        null,
        isAuthenticated: false,
      }),
  })
);
