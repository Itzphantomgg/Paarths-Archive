import { NextResponse } from "next/server";
import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
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
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (error || !data?.user) {
      const msg = error?.message || "";
      let errorResponse = "Failed to initialize new archivist credentials.";
      if (msg.includes("User already registered")) {
        errorResponse = "An account with this email already exists.";
      } else if (msg.includes("Password should be at least")) {
        errorResponse = "Password must be at least 6 characters long.";
      } else if (msg.includes("Invalid API key") || msg.includes("No API key")) {
        errorResponse = "Authentication service configuration error: Supabase API key is invalid or unconfigured.";
      }
      return NextResponse.json(
        { error: errorResponse },
        { status: 400 }
      );
    }

    const dbUser = await syncUserToDb(data.user);

    return NextResponse.json({
      success: true,
      user: dbUser,
      session: Boolean(data.session),
    });
  } catch (error) {
    console.error("[api/auth/register] Register error:", error);
    return NextResponse.json(
      { error: "Failed to initialize new archivist credentials." },
      { status: 500 }
    );
  }
}
