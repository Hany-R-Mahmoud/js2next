export type SupabaseConfig = {
  readonly url: string;
  readonly publishableKey: string;
};

type SupabaseEnvironment = Pick<NodeJS.ProcessEnv, 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'>;

const clientSupabaseEnv: SupabaseEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function readSupabaseConfig(env: SupabaseEnvironment = clientSupabaseEnv): SupabaseConfig | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();
  return url && publishableKey ? { url, publishableKey } : null;
}

export function requireSupabaseConfig(env: SupabaseEnvironment = clientSupabaseEnv): SupabaseConfig {
  const config = readSupabaseConfig(env);
  if (config === null) throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  return config;
}
