import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../lib/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { access_token } = response;

          // Store token
          localStorage.setItem("auth_token", access_token);
          set({ token: access_token });

          // Get user profile
          const user = await authAPI.getProfile();
          set({ user, isLoading: false });

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.detail || "Login failed";
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.register(userData);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage =
            error.response?.data?.detail || "Registration failed";
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout action
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          set({ user: null, token: null, error: null });
        }
      },

      // Initialize auth state from stored token
      initializeAuth: async () => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          set({ token, isLoading: true });
          try {
            const user = await authAPI.getProfile();
            set({ user, isLoading: false });
          } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem("auth_token");
            set({ token: null, isLoading: false });
          }
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Check if user is authenticated
      isAuthenticated: () => {
        const { user, token } = get();
        return !!(user && token);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
