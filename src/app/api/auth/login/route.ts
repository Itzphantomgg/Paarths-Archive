import { NextResponse } from "next/server";
import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: "Authentication service configuration incomplete: Supabase API key is missing or unconfigured. Please configure NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data?.user) {
      const msg = error?.message || "";
      let errorResponse = "Invalid credentials. Vault access denied.";
      if (msg.includes("Invalid login credentials")) {
        errorResponse = "Email or password is incorrect.";
      } else if (msg.includes("Email not confirmed")) {
        errorResponse = "Please verify your email before signing in.";
      } else if (msg.includes("Invalid API key") || msg.includes("No API key")) {
        errorResponse = "Authentication service configuration error: Supabase API key is invalid or unconfigured.";
      }
      return NextResponse.json(
        { error: errorResponse },
        { status: 401 }
      );
    }

    const dbUser = await syncUserToDb(data.user);

    return NextResponse.json({
      success: true,
      user: dbUser,
    });
  } catch (error) {
    console.error("[api/auth/login] Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while entering the vault." },
      { status: 500 }
    );
  }
}
