import { createClient } from "@supabase/supabase-js";

/**
 * Gets environment variables based on the platform
 * Next.js uses NEXT_PUBLIC_ prefix
 * Expo uses EXPO_PUBLIC_ prefix
 */
const getEnvVars = () => {
  // Try Next.js env vars first
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  // Try Expo env vars
  if (typeof process !== "undefined" && process.env.EXPO_PUBLIC_SUPABASE_URL) {
    return {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL,
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  return { url: "", anonKey: "" };
};

const { url, anonKey } = getEnvVars();

// Create a single supabase client for interacting with your database
export const supabase = createClient(url || "", anonKey || "");
