import { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./types";

export const signUp = async (
  client: SupabaseClient<Database>,
  email: string,
  password: string
) => {
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (
  client: SupabaseClient<Database>,
  email: string,
  password: string
) => {
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async (client: SupabaseClient<Database>) => {
  const { error } = await client.auth.signOut();
  return { error };
};

export const getCurrentUser = async (
  client: SupabaseClient<Database>
): Promise<User | null> => {
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
};

export const onAuthStateChange = (
  client: SupabaseClient<Database>,
  callback: (user: User | null) => void
) => {
  return client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};
