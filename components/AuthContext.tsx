"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  UserTier,
  getTierFromUserMetadata,
  fetchProfileTier,
  isMockSupabase,
  TIER_LABELS,
} from '@/lib/supabase';

const MOCK_TIER_KEY = 'alrehan_b2b_tier';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  tier: UserTier;
  tierLabel: string;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setDemoTier: (tier: UserTier) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readMockTier(): UserTier {
  if (typeof window === 'undefined') return 'Retail';
  const stored = localStorage.getItem(MOCK_TIER_KEY);
  if (stored === 'Hotel' || stored === 'Supermarket' || stored === 'Retail') {
    return stored;
  }
  return 'Retail';
}

async function resolveTier(user: User | null): Promise<UserTier> {
  if (!user) {
    return isMockSupabase ? readMockTier() : 'Retail';
  }

  const profileTier = await fetchProfileTier(user.id);
  if (profileTier) return profileTier;

  return getTierFromUserMetadata(user.user_metadata);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tier, setTier] = useState<UserTier>('Retail');
  const [loading, setLoading] = useState(true);

  const applySession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
    const resolvedTier = await resolveTier(nextSession?.user ?? null);
    setTier(resolvedTier);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      applySession(initialSession).finally(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [applySession]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (isMockSupabase) {
      localStorage.removeItem(MOCK_TIER_KEY);
      setTier('Retail');
    }
  };

  const setDemoTier = (nextTier: UserTier) => {
    if (isMockSupabase && !user) {
      localStorage.setItem(MOCK_TIER_KEY, nextTier);
      setTier(nextTier);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        tier,
        tierLabel: TIER_LABELS[tier],
        loading,
        signInWithEmail,
        signOut,
        setDemoTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
