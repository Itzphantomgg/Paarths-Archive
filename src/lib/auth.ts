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

  try {
    // 1. Check if user already exists by Supabase Auth UID
    let existingUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    if (existingUser) {
      if (existingUser.name !== name || existingUser.email !== email) {
        existingUser = await prisma.user.update({
          where: { id: supabaseUser.id },
          data: { name, email },
        });
      }
      return {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      };
    }

    // 2. Check if a user exists with the same email (e.g. initial seed user)
    const userByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userByEmail) {
      // Re-link existing stories and migrate ID to match Supabase UID
      const oldId = userByEmail.id;
      await prisma.$transaction([
        prisma.story.updateMany({
          where: { authorId: oldId },
          data: { authorId: supabaseUser.id },
        }),
        prisma.user.update({
          where: { id: oldId },
          data: { id: supabaseUser.id, name, email },
        }),
      ]);

      return {
        id: supabaseUser.id,
        email,
        name,
        role: userByEmail.role,
      };
    }

    // 3. Create fresh user
    const newUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email,
        name,
        password: "supabase_managed",
        role: "ADMIN",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return newUser;
  } catch (dbErr) {
    console.warn("[auth] syncUserToDb warning (falling back to memory session):", dbErr);
    // Fallback: return session user even if DB sync temporarily fails
    return {
      id: supabaseUser.id,
      email,
      name,
      role: "ADMIN",
    };
  }
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
