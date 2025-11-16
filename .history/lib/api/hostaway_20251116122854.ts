import { HostawayApiResponse, NormalizedReview } from "@/types/review";
import { normalizeReview } from "@/lib/utils/normalize";
import mockReviewsData from "@/data/mock-reviews.json";

const HOSTAWAY_ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID || "61148";
const HOSTAWAY_API_KEY = process.env.HOSTAWAY_API_KEY || "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152";
const HOSTAWAY_BASE_URL = "https://api.hostaway.com/v1";

/**
 * Fetches reviews from Hostaway API
 * Falls back to mock data if API is unavailable or returns no reviews
 */
export async function fetchHostawayReviews(): Promise<NormalizedReview[]> {
  try {
    // Try to fetch from actual API first
    const response = await fetch(
      `${HOSTAWAY_BASE_URL}/reviews?accountId=${HOSTAWAY_ACCOUNT_ID}`,
      {
        headers: {
          "Authorization": `Bearer ${HOSTAWAY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data: HostawayApiResponse = await response.json();
      
      // If API returns reviews, use them
      if (data.status === "success" && data.result && data.result.length > 0) {
        return data.result.map(normalizeReview);
      }
    }
  } catch (error) {
    console.warn("Hostaway API unavailable, using mock data:", error);
  }

  // Fall back to mock data
  // The mock data should match the Hostaway API response format
  const mockData = mockReviewsData as HostawayApiResponse;
  
  if (mockData.status === "success" && mockData.result) {
    return mockData.result.map(normalizeReview);
  }

  // If mock data is also invalid, return empty array
  return [];
}

