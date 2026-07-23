export type SupabaseConfig = {
  readonly url: string;
  readonly publishableKey: string;
};

export function readSupabaseConfig(env: NodeJS.ProcessEnv = process.env): SupabaseConfig | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();
  return url && publishableKey ? { url, publishableKey } : null;
}

export function requireSupabaseConfig(env: NodeJS.ProcessEnv = process.env): SupabaseConfig {
  const config = readSupabaseConfig(env);
  if (config === null) throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  return config;
}
