import { NextResponse } from "next/server";
import { fetchHostawayReviews } from "@/lib/api/hostaway";
import { getPropertyId } from "@/lib/utils/parseProperty";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyAddress = searchParams.get("property");
    const approvedIdsParam = searchParams.get("approvedIds");

    // Get all reviews
    const allReviews = await fetchHostawayReviews();

    // Filter by property if provided
    let filteredReviews = allReviews;
    
    if (propertyAddress) {
      filteredReviews = allReviews.filter(
        (review) => getPropertyId(review.listingName) === propertyAddress
      );
    }

    // Filter by approved IDs if provided (comma-separated)
    // If approvedIds is provided, only return those specific reviews
    // If not provided, return all reviews for the property (for summary calculation)
    if (approvedIdsParam && approvedIdsParam.trim() !== "") {
      const approvedIds = new Set(
        approvedIdsParam.split(",").map((id) => parseInt(id, 10))
      );
      filteredReviews = filteredReviews.filter((review) =>
        approvedIds.has(review.id)
      );
    }
    // If no approvedIds provided, return all reviews for the property (used for summary stats)

    return NextResponse.json({
      reviews: filteredReviews,
      total: filteredReviews.length,
    });
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

