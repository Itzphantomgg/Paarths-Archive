import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data?.user) {
      return NextResponse.json(
        { error: error?.message || "Invalid credentials. Vault access denied." },
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
