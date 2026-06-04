"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

// NOTE: Les emails admin ne sont PAS stockés ici (bundle client public).
// La vérification admin se fait uniquement côté serveur (middleware + requireAdmin).
// Côté client on utilise uniquement la RPC SECURITY DEFINER.

interface AuthCtx {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, isAdmin: false, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (u: User | null) => {
    if (!u) { setIsAdmin(false); return; }
    // Vérification via RPC SECURITY DEFINER (server-side, ne révèle rien côté client)
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_my_is_admin");
      if (!error) setIsAdmin(data === true);
    } catch { /* silently ignore */ }
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      checkAdmin(u).finally(() => setLoading(false));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      checkAdmin(u);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
