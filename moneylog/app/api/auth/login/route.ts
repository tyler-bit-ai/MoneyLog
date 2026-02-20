import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSessionToken, getSessionCookieName, getSessionTtlSeconds, isPasswordValid } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const password = String(formData.get("password") ?? "");

    if (!isPasswordValid(password)) {
      return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303);
    }

    const cookieStore = await cookies();
    cookieStore.set(getSessionCookieName(), createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getSessionTtlSeconds(),
      path: "/",
    });

    return NextResponse.redirect(new URL("/", request.url), 303);
  } catch {
    return NextResponse.redirect(new URL("/login?error=config", request.url), 303);
  }
}
