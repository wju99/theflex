import { HostawayReview, NormalizedReview } from "@/types/review";

/**
 * Normalizes Hostaway API review data to a consistent format
 */
export function normalizeReview(review: HostawayReview): NormalizedReview {
  return {
    id: review.id,
    type: review.type,
    status: review.status,
    rating: review.rating,
    publicReview: review.publicReview,
    reviewCategories: review.reviewCategory || [],
    submittedAt: review.submittedAt,
    guestName: review.guestName,
    listingName: review.listingName,
    channel: extractChannel(review.listingName),
    approvedForDisplay: false, // Default to false, will be managed by database
  };
}

/**
 * Extract channel from listing name (e.g., "Airbnb - 2B N1 A")
 * This is a simple heuristic - in production, this might come from API metadata
 */
function extractChannel(listingName: string): string | undefined {
  const lowerName = listingName.toLowerCase();
  if (lowerName.includes("airbnb")) return "Airbnb";
  if (lowerName.includes("booking")) return "Booking.com";
  if (lowerName.includes("vrbo")) return "VRBO";
  if (lowerName.includes("expedia")) return "Expedia";
  return undefined;
}

