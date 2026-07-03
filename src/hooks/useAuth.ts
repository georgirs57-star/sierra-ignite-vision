import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type Profile = {
  user_id: string;
  name: string | null;
  level: string | null;
  xp: number;
  avatar_url: string | null;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    void fetchProfile(session.user).then(setProfile);
  }, [session?.user?.id]);

  return { session, user: session?.user ?? null, profile, loading };
}

async function fetchProfile(user: User): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id,name,level,xp,avatar_url")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.warn("[useAuth] profile fetch", error.message);
    return null;
  }
  return data as Profile | null;
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/home` },
  });
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, meta?: Record<string, unknown>) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/home`,
      data: meta,
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function logXp(userId: string, action: string, xp: number) {
  return supabase.from("xp_log").insert({ user_id: userId, action, xp_gained: xp });
}
