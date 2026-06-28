import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes('mock-project') &&
  !supabaseUrl.includes('placeholder');

export const isMockSupabase = !isSupabaseConfigured;

export const isAdminClientConfigured =
  isSupabaseConfigured && supabaseServiceRoleKey.length > 0;

function createBrowserClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key',
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Browser + client components — anon key only, respects RLS */
export const supabase = createBrowserClient();

/**
 * Server-side reads/writes that respect RLS (uses anon key).
 * Use for SSR product fetches, authenticated user operations, etc.
 */
export function createServerClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Server-only admin client — bypasses RLS.
 * NEVER import this in client components ("use client").
 * Requires SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix).
 */
export function createAdminClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL in .env.local'
    );
  }
  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing. Add it to .env.local (server-only, no NEXT_PUBLIC_ prefix).'
    );
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type UserTier = 'Retail' | 'Hotel' | 'Supermarket';

export type DbProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  tier: UserTier;
  created_at: string;
  updated_at: string;
};

export type DbProductRow = {
  id: number;
  sku: string;
  name: string;
  category: string;
  status: 'متوفر' | 'عند الطلب';
  image_url: string;
  base_price: number;
  is_active: boolean;
};

export const TIER_LABELS: Record<UserTier, string> = {
  Retail: 'تجزئة',
  Hotel: 'فندق',
  Supermarket: 'سوبرماركت',
};

export function getDiscountForTier(tier: UserTier): number {
  switch (tier) {
    case 'Hotel':
      return 0.15;
    case 'Supermarket':
      return 0.2;
    default:
      return 0;
  }
}

export function getTierFromUserMetadata(
  metadata: Record<string, unknown> | undefined
): UserTier {
  const tier = metadata?.tier;
  if (tier === 'Hotel' || tier === 'Supermarket' || tier === 'Retail') {
    return tier;
  }
  return 'Retail';
}

export function calculateTierPrice(basePrice: number, tier: UserTier): number {
  return Math.round(basePrice * (1 - getDiscountForTier(tier)) * 100) / 100;
}

export async function fetchProfileTier(userId: string): Promise<UserTier | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', userId)
    .single();

  if (error || !data?.tier) return null;

  const tier = data.tier as UserTier;
  if (tier === 'Hotel' || tier === 'Supermarket' || tier === 'Retail') {
    return tier;
  }
  return null;
}
