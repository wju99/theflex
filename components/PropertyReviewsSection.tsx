"use client";

import { NormalizedReview } from "@/types/review";
import { parsePropertyAddress, parseUnitInfo } from "@/lib/utils/parseProperty";
import Image from "next/image";

interface PropertyReviewsSectionProps {
  allReviews: NormalizedReview[];
  approvedReviews: NormalizedReview[];
  propertyAddress: string;
}

export function PropertyReviewsSection({
  allReviews,
  approvedReviews,
  propertyAddress,
}: PropertyReviewsSectionProps) {
  // Always calculate summary from ALL reviews for the property
  // This is independent of whether reviews are approved or not
  const ratings = allReviews.filter((r) => r.rating !== null && r.rating !== undefined);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
      : 0;

  // Rating distribution from ALL reviews (always use all reviews for summary)
  const ratingCounts = {
    5: allReviews.filter((r) => r.rating === 5).length,
    4: allReviews.filter((r) => r.rating === 4).length,
    3: allReviews.filter((r) => r.rating === 3).length,
    2: allReviews.filter((r) => r.rating === 2).length,
    1: allReviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Reviews</h2>

      {/* Rating Summary */}
      <div className="flex items-start gap-8 mb-8 pb-8 border-b border-gray-200">
        <div className="text-center">
          <div className="text-5xl font-bold text-[#1a4d3a] mb-2">
            {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Based on {allReviews.length} review{allReviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating as keyof typeof ratingCounts];
            const percentage =
              allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-8">{rating}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#1a4d3a] h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List - Only show approved reviews */}
      {approvedReviews.length > 0 ? (
        <div className="space-y-6">
          {approvedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-[#1a4d3a] rounded-full flex items-center justify-center text-white font-semibold">
                    {review.guestName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.guestName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.submittedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {review.channel && (
                  <div className="ml-16 mb-2">
                    {review.channel.toLowerCase().includes("airbnb") && (
                      <Image
                        src="/airbnb-logo.png"
                        alt="Airbnb"
                        width={60}
                        height={20}
                        className="h-5 w-auto opacity-70 object-contain"
                      />
                    )}
                    {review.channel.toLowerCase().includes("booking") && (
                      <Image
                        src="/booking-logo.png"
                        alt="Booking.com"
                        width={80}
                        height={20}
                        className="h-4 w-auto opacity-70 object-contain"
                      />
                    )}
                    {review.channel.toLowerCase().includes("vrbo") && (
                      <Image
                        src="/vrbo-logo.png"
                        alt="VRBO"
                        width={50}
                        height={20}
                        className="h-4 w-auto opacity-70 object-contain"
                      />
                    )}
                  </div>
                )}
              </div>
              {review.rating !== null && review.rating !== undefined && (
                <div className="flex items-center gap-1">
                  <span
                    className={`text-2xl font-bold ${
                      review.rating >= 4
                        ? "text-green-600"
                        : review.rating >= 2
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                  >
                    {review.rating}
                  </span>
                  <span className="text-gray-500">/5</span>
                </div>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed ml-16 mb-3">
              {review.publicReview}
            </p>
            {review.reviewCategories && review.reviewCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 ml-16">
                {review.reviewCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-[#f5f1eb] text-gray-700 px-3 py-1.5 rounded-full font-medium capitalize"
                  >
                    {cat.category.replace(/_/g, " ")}: {cat.rating}/10
                  </div>
                ))}
              </div>
            )}
          </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No approved reviews to display yet.</p>
        </div>
      )}
    </div>
  );
}

