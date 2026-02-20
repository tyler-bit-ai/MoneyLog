import { NextResponse } from "next/server";

import { getDashboardSnapshot } from "@/lib/dashboard";

export async function GET() {
  try {
    const snapshot = await getDashboardSnapshot();

    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "private, max-age=0, s-maxage=300, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to load dashboard snapshot",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
