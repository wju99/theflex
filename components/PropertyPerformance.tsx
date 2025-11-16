"use client";

import { NormalizedReview } from "@/types/review";
import { getPropertyId, getPropertyUrlId } from "@/lib/utils/parseProperty";
import Image from "next/image";
import Link from "next/link";

interface PropertyPerformanceProps {
  reviews: NormalizedReview[];
}

interface PropertyStats {
  name: string;
  urlId: string;
  totalReviews: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  lowRatingCount: number;
  recentReviews: number;
  channels: string[];
  commonIssues: string[];
}

export function PropertyPerformance({ reviews }: PropertyPerformanceProps) {
  // Group reviews by property (using parsed address)
  const propertyStats = reviews.reduce((acc, review) => {
    const propertyId = getPropertyId(review.listingName);
    if (!acc[propertyId]) {
      acc[propertyId] = {
        name: propertyId,
        urlId: getPropertyUrlId(review.listingName),
        reviews: [],
        ratings: [] as number[],
        channels: new Set<string>(),
        categories: [] as string[],
      };
    }
    acc[propertyId].reviews.push(review);
    if (review.rating) acc[propertyId].ratings.push(review.rating);
    if (review.channel) acc[propertyId].channels.add(review.channel);
    review.reviewCategories?.forEach((cat) => {
      if (cat.rating < 7) {
        acc[propertyId].categories.push(cat.category);
      }
    });
    return acc;
  }, {} as Record<string, any>);

  // Calculate stats for each property
  const properties: PropertyStats[] = Object.values(propertyStats).map(
    (prop: any) => {
      const ratings = prop.ratings;
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : 0;

      // Recent reviews (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentReviews = prop.reviews.filter(
        (r: NormalizedReview) => new Date(r.submittedAt) >= thirtyDaysAgo
      ).length;

      // Common issues (categories with rating < 7)
      const issueCounts = prop.categories.reduce((acc: any, cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});
      const commonIssues = Object.entries(issueCounts)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 3)
        .map(([cat]) => cat.replace(/_/g, " "));

      return {
        name: prop.name,
        urlId: prop.urlId,
        totalReviews: prop.reviews.length,
        averageRating,
        fiveStarCount: ratings.filter((r: number) => r === 5).length,
        fourStarCount: ratings.filter((r: number) => r === 4).length,
        threeStarCount: ratings.filter((r: number) => r === 3).length,
        lowRatingCount: ratings.filter((r: number) => r < 3).length,
        recentReviews,
        channels: Array.from(prop.channels),
        commonIssues,
      };
    }
  );

  // Sort by average rating (descending)
  properties.sort((a, b) => b.averageRating - a.averageRating);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#1a4d3a] hover:shadow-xl transition-shadow flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {property.name}
            </h3>

            <div className="space-y-4 flex-1">
              {/* Rating Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="text-2xl font-bold text-[#1a4d3a]">
                    {property.averageRating > 0
                      ? property.averageRating.toFixed(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const avgRating = property.averageRating;
                    const isFilled = avgRating >= star;
                    const isPartial = avgRating > star - 1 && avgRating < star;
                    const partialPercentage = isPartial 
                      ? ((avgRating - (star - 1)) * 100).toFixed(0)
                      : 0;
                    
                    let barColor = "bg-gray-100"; // unfilled bars
                    
                    if (isFilled || isPartial) {
                      // Color based on average rating value
                      if (avgRating >= 4) {
                        barColor = "bg-green-500";
                      } else if (avgRating >= 2) {
                        barColor = "bg-orange-500";
                      } else {
                        barColor = "bg-red-500";
                      }
                    }
                    
                    return (
                      <div
                        key={star}
                        className="flex-1 rounded h-2 bg-gray-100 relative overflow-hidden flex"
                      >
                        {(isFilled || isPartial) && (
                          <div
                            className={`h-2 rounded ${barColor} ${isPartial ? "ml-auto" : ""}`}
                            style={{
                              width: isFilled 
                                ? "100%" 
                                : `${partialPercentage}%`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500">Total Reviews</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {property.totalReviews}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Recent (30d)</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {property.recentReviews}
                  </div>
                </div>
              </div>

              {/* Channels */}
              {property.channels.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Channels</div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {property.channels.map((channel, i) => (
                      <div key={i} className="flex items-center">
                        {channel.toLowerCase().includes("airbnb") && (
                          <Image
                            src="/airbnb-logo.png"
                            alt="Airbnb"
                            width={60}
                            height={20}
                            className="h-5 w-auto opacity-70 object-contain"
                          />
                        )}
                        {channel.toLowerCase().includes("booking") && (
                          <Image
                            src="/booking-logo.png"
                            alt="Booking.com"
                            width={80}
                            height={20}
                            className="h-4 w-auto opacity-70 object-contain"
                          />
                        )}
                        {channel.toLowerCase().includes("vrbo") && (
                          <Image
                            src="/vrbo-logo.png"
                            alt="VRBO"
                            width={50}
                            height={20}
                            className="h-4 w-auto opacity-70 object-contain"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Issues */}
              {property.commonIssues.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">
                    Recurring Issues
                  </div>
                  <div className="space-y-1">
                    {property.commonIssues.map((issue, i) => (
                      <div
                        key={i}
                        className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded capitalize"
                      >
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* View on Site Button - Fixed at bottom */}
            <div className="pt-4 mt-auto border-t border-gray-100">
              <Link
                href={`/properties/${property.urlId}`}
                className="block w-full text-center px-4 py-2.5 text-[#1a4d3a] rounded-lg hover:text-[#2d6b4f] hover:bg-[#1a4d3a]/5 hover:underline transition-all font-medium text-sm"
              >
                View on Site
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

