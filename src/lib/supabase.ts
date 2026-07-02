import { createClient } from "@supabase/supabase-js";

// Projet Supabase de l'utilisateur (clé publishable — safe côté client)
export const SUPABASE_URL = "https://onimodisuljhrcbyvews.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_45_kkBjFxTC2XorYK2vUAQ_rNguAvl4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Appelle une Edge Function Supabase.
 * @param name  nom de la function (ex: "sierra-chat")
 * @param body  payload JSON
 */
export async function invokeEdgeFunction<T = unknown>(
  name: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (error) throw error;
  return data as T;
}
