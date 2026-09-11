import { createBrowserClient } from "@supabase/ssr";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ixxodobbackxxlwdwqzk.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return false;
  if (
    key === "ey-build-fallback-anon-key" ||
    key === "your-supabase-anon-key" ||
    key.trim() === ""
  ) {
    return false;
  }
  return true;
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ixxodobbackxxlwdwqzk.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "ey-build-fallback-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
