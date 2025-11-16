"use client";

interface ReviewStatsProps {
  reviews: any[];
  approvedCount: number;
}

export function ReviewStats({ reviews, approvedCount }: ReviewStatsProps) {
  const totalReviews = reviews.length;
  const reviewsWithRating = reviews.filter((r) => r.rating);
  const averageRating =
    reviewsWithRating.length > 0
      ? reviewsWithRating.reduce((sum, r) => sum + (r.rating || 0), 0) /
        reviewsWithRating.length
      : 0;
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;
  const threeStarCount = reviews.filter((r) => r.rating === 3).length;

  const stats = [
    {
      label: "Total Reviews",
      value: totalReviews,
      color: "bg-[#1a4d3a]",
    },
    {
      label: "Average Rating",
      value: averageRating > 0 ? averageRating.toFixed(1) : "N/A",
      color: "bg-[#2d6b4f]",
    },
    {
      label: "Approved for Display",
      value: approvedCount,
      color: "bg-[#1a4d3a]",
    },
    {
      label: "5 Star Reviews",
      value: fiveStarCount,
      color: "bg-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4"
          style={{ borderLeftColor: stat.color.replace("bg-", "#") }}
        >
          <div className="text-sm font-medium text-gray-600 mb-1">
            {stat.label}
          </div>
          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

