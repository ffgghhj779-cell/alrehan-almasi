"use client";

import { useAuth } from './AuthContext';
import { isMockSupabase, UserTier, TIER_LABELS } from '@/lib/supabase';

const TIERS: UserTier[] = ['Retail', 'Hotel', 'Supermarket'];

export default function TierSelector() {
  const { tier, setDemoTier, user, loading } = useAuth();

  if (loading || user || !isMockSupabase) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-l from-secondary to-primary border border-blue-primary/10 luxury-shadow">
      <span className="text-sm font-bold text-blue-deep font-cairo">
        مستوى التسعير B2B (تجريبي):
      </span>
      {TIERS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setDemoTier(t)}
          className={`px-4 py-1.5 text-sm font-bold transition-all ${
            tier === t
              ? 'bg-blue-primary text-white luxury-shadow'
              : 'bg-white text-blue-deep border border-blue-primary/20 hover:border-orange-accent'
          }`}
        >
          {TIER_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
