"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";

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
  try {
    const res = await fetch("/api/reviews/hostaway", {
      cache: "no-store",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch reviews: ${res.status}`);
    }
    const data = await res.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

export default function DashboardPage() {
  const { data: reviews, isLoading, error, isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    retry: 2,
    retryDelay: 1000,
  });

  // Debug logging
  useEffect(() => {
    if (isLoading) {
      console.log("Loading reviews...");
    }
    if (error) {
      console.error("Error:", error);
    }
    if (reviews) {
      console.log("Reviews loaded:", reviews.length);
    }
  }, [isLoading, error, reviews]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center bg-[#f5f1eb]">
          <div className="text-center">
            <div className="text-xl text-gray-700 mb-2">Loading reviews...</div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4d3a] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center bg-[#f5f1eb]">
          <div className="text-center max-w-md">
            <div className="text-xl text-red-600 mb-2">
              Error loading reviews
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#1a4d3a] text-white rounded-lg hover:bg-[#2d6b4f] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f1eb]">
      <DashboardHeader />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Reviews Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and review guest feedback for your properties
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Total Reviews: {reviews?.length || 0}
              </h2>
            </div>

            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {review.listingName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Guest: {review.guestName}
                        </p>
                        {review.channel && (
                          <span className="inline-block text-xs bg-[#1a4d3a] text-white px-3 py-1 rounded-full">
                            {review.channel}
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        {review.rating && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-3xl font-bold text-[#1a4d3a]">
                              {review.rating}
                            </span>
                            <span className="text-gray-500">/5</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(review.submittedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {review.publicReview}
                    </p>
                    {review.reviewCategories &&
                      review.reviewCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                          {review.reviewCategories.map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-[#f5f1eb] text-gray-700 px-3 py-1.5 rounded-full font-medium capitalize"
                            >
                              {cat.category.replace(/_/g, " ")}: {cat.rating}
                              /10
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No reviews found
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

