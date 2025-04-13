"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import Cookies from "js-cookie"; // Import js-cookie

// Create Authentication Context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in cookies
    const storedSession = Cookies.get("supabase-session");
    if (storedSession) {
      const session = JSON.parse(storedSession);
      setUser(session?.user || null);
    }

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        Cookies.set("supabase-session", JSON.stringify(session), { expires: 7 });
      } else {
        setUser(null);
        Cookies.remove("supabase-session");
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        Cookies.set("supabase-session", JSON.stringify(session), { expires: 7 });
      } else {
        setUser(null);
        Cookies.remove("supabase-session");
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use Auth Context
export function useAuth() {
  return useContext(AuthContext);
}
