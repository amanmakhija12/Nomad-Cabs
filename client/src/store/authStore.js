import { create } from "zustand";

const STORAGE_KEY = "nomad_auth_user";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },
  isAuthenticated: () => !!get().user,
  hasRole: (role) => get().user?.role === role,
}));
