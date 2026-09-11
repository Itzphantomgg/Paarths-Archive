import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
      return NextResponse.json(
        { error: error?.message || "Failed to initialize new archivist credentials." },
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
