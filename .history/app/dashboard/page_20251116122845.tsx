"use client";

import { useQuery } from "@tanstack/react-query";

interface Review {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategories: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel?: string;
}

async function fetchReviews(): Promise<Review[]> {
  const res = await fetch("/api/reviews/hostaway");
  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const data = await res.json();
  return data.reviews || [];
}

export default function DashboardPage() {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          Error loading reviews: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Reviews Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Total Reviews: {reviews?.length || 0}
            </h2>
          </div>

          <div className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {review.listingName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Guest: {review.guestName}
                      </p>
                    </div>
                    <div className="text-right">
                      {review.rating && (
                        <div className="text-2xl font-bold">
                          {review.rating}/5
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.publicReview}</p>
                  {review.reviewCategories && review.reviewCategories.length > 0 && (
                    <div className="flex gap-4 mt-2">
                      {review.reviewCategories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {cat.category}: {cat.rating}/10
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

