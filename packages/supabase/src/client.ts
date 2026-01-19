import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let supabaseInstance: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (
  supabaseUrl: string,
  supabaseAnonKey: string
): SupabaseClient<Database> => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// For web (Next.js)
export const createWebClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return getSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// For mobile (Expo)
export const createMobileClient = () => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
  return getSupabaseClient(supabaseUrl, supabaseAnonKey);
};
