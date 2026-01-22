import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./client";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        set({ user: data.user, isAuthenticated: !!data.user });
        return data.user;
      },

      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        set({ user: data.user, isAuthenticated: true });
        return data.user;
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, isAuthenticated: false });
      },

      initAuth: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          set({ user, isAuthenticated: true });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            set({ user: session.user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        });
      },
    }),
    { name: "auth-storage" },
  ),
);
