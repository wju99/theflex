"use client";

import { NormalizedReview } from "@/types/review";
import { useMemo } from "react";
import Link from "next/link";
import { getPropertyId } from "@/lib/utils/parseProperty";

interface DashboardOverviewProps {
  reviews: NormalizedReview[];
  approvedCount: number;
  onNavigateToTab?: (tab: string) => void;
}

export function DashboardOverview({
  reviews,
  approvedCount,
  onNavigateToTab,
}: DashboardOverviewProps) {
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const reviewsWithRating = reviews.filter((r) => r.rating);
    const averageRating =
      reviewsWithRating.length > 0
        ? reviewsWithRating.reduce((sum, r) => sum + (r.rating || 0), 0) /
          reviewsWithRating.length
        : 0;

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviews.filter(
      (r) => new Date(r.submittedAt) >= thirtyDaysAgo
    );

    // Properties performance (using parsed address)
    const propertyStats = reviews.reduce((acc, review) => {
      const propertyId = getPropertyId(review.listingName);
      if (!acc[propertyId]) {
        acc[propertyId] = {
          name: propertyId,
          reviews: [],
          ratings: [] as number[],
        };
      }
      acc[propertyId].reviews.push(review);
      if (review.rating) acc[propertyId].ratings.push(review.rating);
      return acc;
    }, {} as Record<string, any>);

    const properties = Object.values(propertyStats).map((prop: any) => {
      const ratings = prop.ratings;
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : 0;
      return {
        name: prop.name,
        avgRating,
        totalReviews: prop.reviews.length,
      };
    });

    const topProperties = [...properties]
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
    const bottomProperties = [...properties]
      .sort((a, b) => a.avgRating - b.avgRating)
      .slice(0, 3)
      .filter((p) => p.avgRating < 4);

    // Recent reviews (last 5)
    const sortedRecent = [...recentReviews]
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() -
          new Date(a.submittedAt).getTime()
      )
      .slice(0, 5);

    // Trend analysis (comparing last 30 days to previous 30 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const previousPeriod = reviews.filter(
      (r) =>
        new Date(r.submittedAt) >= sixtyDaysAgo &&
        new Date(r.submittedAt) < thirtyDaysAgo
    );
    const currentPeriod = recentReviews;

    const previousAvg =
      previousPeriod.filter((r) => r.rating).length > 0
        ? previousPeriod
            .filter((r) => r.rating)
            .reduce((sum, r) => sum + (r.rating || 0), 0) /
          previousPeriod.filter((r) => r.rating).length
        : 0;
    const currentAvg =
      currentPeriod.filter((r) => r.rating).length > 0
        ? currentPeriod
            .filter((r) => r.rating)
            .reduce((sum, r) => sum + (r.rating || 0), 0) /
          currentPeriod.filter((r) => r.rating).length
        : 0;
    const ratingTrend = currentAvg - previousAvg;

    // Recurring issues
    const issueCounts = reviews.reduce((acc, review) => {
      review.reviewCategories?.forEach((cat) => {
        if (cat.rating < 7) {
          const key = cat.category;
          acc[key] = (acc[key] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    const topIssues = Object.entries(issueCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category.replace(/_/g, " "));

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      recentReviews: recentReviews.length,
      recentReviewsList: sortedRecent,
      topProperties,
      bottomProperties,
      ratingTrend,
      topIssues,
    };
  }, [reviews]);


  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#1a4d3a]">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Total Reviews
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.totalReviews}
          </div>
          <div className="text-xs text-gray-500">
            {stats.recentReviews} in last 30 days
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#2d6b4f]">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Average Rating
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A"}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {stats.ratingTrend !== 0 && (
              <span
                className={`${
                  stats.ratingTrend > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.ratingTrend > 0 ? "↑" : "↓"} {Math.abs(stats.ratingTrend).toFixed(1)}
              </span>
            )}
            <span className="text-gray-500">vs previous period</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#1a4d3a]">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Properties
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.topProperties.length + stats.bottomProperties.length}
          </div>
          <div className="text-xs text-gray-500">Active listings</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Displaying
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {approvedCount}
          </div>
          <div className="text-xs text-gray-500">
            {stats.totalReviews > 0
              ? `${((approvedCount / stats.totalReviews) * 100).toFixed(0)}% of total`
              : "0% of total"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Performance Summary */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Property Performance
            </h3>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("properties")}
                className="text-sm text-[#1a4d3a] hover:text-[#2d6b4f] font-medium"
              >
                View All →
              </button>
            )}
          </div>
          <div className="space-y-4">
            {/* Top Performers */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Top Performers
              </h4>
              <div className="space-y-2">
                {stats.topProperties.length > 0 ? (
                  stats.topProperties.map((prop, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {prop.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {prop.totalReviews} reviews
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#1a4d3a]">
                          {prop.avgRating.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">avg rating</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No data available</p>
                )}
              </div>
            </div>

            {/* Needs Attention */}
            {stats.bottomProperties.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Needs Attention
                </h4>
                <div className="space-y-2">
                  {stats.bottomProperties.map((prop, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {prop.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {prop.totalReviews} reviews
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {prop.avgRating.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">avg rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews & Trends */}
        <div className="space-y-6">
          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Reviews
              </h3>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab("reviews")}
                  className="text-sm text-[#1a4d3a] hover:text-[#2d6b4f] font-medium"
                >
                  View All →
                </button>
              )}
            </div>
            <div className="space-y-3">
              {stats.recentReviewsList.length > 0 ? (
                stats.recentReviewsList.map((review, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {review.listingName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {review.guestName}
                        </div>
                      </div>
                      {review.rating !== null && review.rating !== undefined ? (
                        <div
                          className={`text-sm font-bold ml-2 ${
                            review.rating >= 4
                              ? "text-green-600"
                              : review.rating >= 2
                              ? "text-orange-500"
                              : "text-red-500"
                          }`}
                        >
                          {review.rating}/5
                        </div>
                      ) : (
                        <div className="ml-2">
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-medium">
                            No Rating
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {review.publicReview}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(review.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent reviews</p>
              )}
            </div>
          </div>

          {/* Recurring Issues */}
          {stats.topIssues.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recurring Issues
                </h3>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab("trends")}
                    className="text-sm text-[#1a4d3a] hover:text-[#2d6b4f] font-medium"
                  >
                    View Details →
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {stats.topIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-orange-50 rounded"
                  >
                    <span className="text-sm text-gray-700 capitalize">
                      {issue}
                    </span>
                    <span className="text-xs text-orange-600 font-medium">
                      Issue
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
