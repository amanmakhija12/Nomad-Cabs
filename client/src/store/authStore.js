import { create } from "zustand";

const STORAGE_KEY = "nomad_auth_user";
const TOKEN_KEY = "nomad_auth_token";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: getStoredToken(),

  setAuth: (user, token) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },

  setUser: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token });
  },
 
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
  },
  
  isAuthenticated: () => {
    const state = get();
    return !!(state.user && state.token);
  },
  
  hasRole: (role) => {
    const user = get().user;
    return user?.role?.toUpperCase() === role?.toUpperCase();
  },
  
  getToken: () => get().token,
}));