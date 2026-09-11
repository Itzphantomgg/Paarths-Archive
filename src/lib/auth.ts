import { createClient } from "@/lib/supabase/server";
import { prisma } from "./db";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Synchronize an authenticated Supabase user into the Prisma database.
 * Ensures referential integrity for stories and author relations.
 */
export async function syncUserToDb(supabaseUser: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any>;
}): Promise<SessionUser> {
  const email = supabaseUser.email?.toLowerCase().trim() || `${supabaseUser.id}@archive.local`;
  const name =
    supabaseUser.user_metadata?.name ||
    supabaseUser.user_metadata?.full_name ||
    email.split("@")[0] ||
    "Archivist";

  const dbUser = await prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: {
      email,
      name,
    },
    create: {
      id: supabaseUser.id,
      email,
      name,
      password: "", // Handled by Supabase Auth
      role: "ADMIN",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return dbUser;
}

/**
 * Get the currently authenticated user from Supabase SSR session.
 * Used by Server Components, Server Actions, and API Routes.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return await syncUserToDb(user);
  } catch (err) {
    console.error("[auth] Error resolving current user:", err);
    return null;
  }
}
