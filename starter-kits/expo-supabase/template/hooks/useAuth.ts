import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

/**
 * Authentication hook that manages session state and provides auth actions.
 * Listens to Supabase auth state changes and keeps session/user in sync.
 */
export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: false,
    initialized: false,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        session,
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      });
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setState((prev) => ({ ...prev, loading: false }));
      Alert.alert("Sign In Failed", error.message);
      throw error;
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || null,
          },
        },
      });
      if (error) {
        setState((prev) => ({ ...prev, loading: false }));
        Alert.alert("Sign Up Failed", error.message);
        throw error;
      }
      setState((prev) => ({ ...prev, loading: false }));
      Alert.alert(
        "Check Your Email",
        "We sent you a confirmation link. Please verify your email to continue."
      );
    },
    []
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signOut();
    if (error) {
      setState((prev) => ({ ...prev, loading: false }));
      Alert.alert("Sign Out Failed", error.message);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase()
    );
    setState((prev) => ({ ...prev, loading: false }));
    if (error) {
      Alert.alert("Reset Failed", error.message);
      throw error;
    }
    Alert.alert(
      "Email Sent",
      "Check your inbox for a password reset link."
    );
  }, []);

  const signInWithApple = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: "expolaunch://auth/callback",
      },
    });
    if (error) {
      setState((prev) => ({ ...prev, loading: false }));
      Alert.alert("Apple Sign In Failed", error.message);
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "expolaunch://auth/callback",
      },
    });
    if (error) {
      setState((prev) => ({ ...prev, loading: false }));
      Alert.alert("Google Sign In Failed", error.message);
      throw error;
    }
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithApple,
    signInWithGoogle,
  };
}
