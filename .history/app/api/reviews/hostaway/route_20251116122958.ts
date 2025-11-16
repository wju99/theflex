import { NextResponse } from "next/server";
import { fetchHostawayReviews } from "@/lib/api/hostaway";

export async function GET() {
  try {
    const reviews = await fetchHostawayReviews();

    return NextResponse.json({
      reviews,
      total: reviews.length,
      lastFetched: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

