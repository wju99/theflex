"use client";

import { NormalizedReview } from "@/types/review";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

interface TrendsAnalysisProps {
  reviews: NormalizedReview[];
}

export function TrendsAnalysis({ reviews }: TrendsAnalysisProps) {
  // Prepare data for rating trends over time
  const monthlyData = reviews.reduce((acc, review) => {
    const date = new Date(review.submittedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, count: 0, totalRating: 0, ratings: [] };
    }
    acc[monthKey].count++;
    if (review.rating) {
      acc[monthKey].ratings.push(review.rating);
      acc[monthKey].totalRating += review.rating;
    }
    return acc;
  }, {} as Record<string, any>);

  const trendData = Object.entries(monthlyData)
    .map(([month, data]: [string, any]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      reviews: data.count,
      avgRating: data.ratings.length > 0 
        ? data.totalRating / data.ratings.length 
        : 0,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Category performance
  const categoryData = reviews.reduce((acc, review) => {
    review.reviewCategories?.forEach((cat) => {
      if (!acc[cat.category]) {
        acc[cat.category] = { category: cat.category, total: 0, count: 0, lowRatings: 0 };
      }
      acc[cat.category].total += cat.rating;
      acc[cat.category].count++;
      if (cat.rating < 7) {
        acc[cat.category].lowRatings++;
      }
    });
    return acc;
  }, {} as Record<string, any>);

  const categoryChartData = Object.values(categoryData)
    .map((data: any) => ({
      category: data.category.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
      avgRating: data.count > 0 ? (data.total / data.count).toFixed(1) : 0,
      lowRatings: data.lowRatings,
    }))
    .sort((a, b) => Number(b.avgRating) - Number(a.avgRating))
    .slice(0, 8)
    .map((item) => ({ ...item, avgRating: Number(item.avgRating) }));

  // Recurring issues - categories with low ratings (any rating < 7)
  const recurringIssues = Object.values(categoryData)
    .map((data: any) => ({
      category: data.category.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
      avgRating: data.count > 0 ? data.total / data.count : 0,
      lowRatingCount: data.lowRatings,
    }))
    .filter((item) => item.lowRatingCount > 0) // Show categories that have ANY low ratings
    .sort((a, b) => b.lowRatingCount - a.lowRatingCount) // Sort by count of low ratings
    .slice(0, 5);

  // Channel performance
  const channelData = reviews.reduce((acc, review) => {
    if (review.channel) {
      if (!acc[review.channel]) {
        acc[review.channel] = { channel: review.channel, total: 0, count: 0 };
      }
      if (review.rating) {
        acc[review.channel].total += review.rating;
        acc[review.channel].count++;
      }
    }
    return acc;
  }, {} as Record<string, any>);

  const channelChartData = Object.values(channelData)
    .map((data: any) => ({
      channel: data.channel,
      avgRating: data.count > 0 ? (data.total / data.count).toFixed(1) : 0,
    }))
    .sort((a, b) => Number(b.avgRating) - Number(a.avgRating))
    .map((item) => ({ ...item, avgRating: Number(item.avgRating) }));

  return (
    <div className="space-y-8">
      {/* Rating Trends Over Time */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rating Trends Over Time
        </h3>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgRating"
                stroke="#10b981"
                strokeWidth={3}
                name="Avg Rating"
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No trend data available</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Performance
          </h3>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="avgRating" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No category data available</p>
          )}
        </div>

        {/* Channel Performance */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Channel Performance
          </h3>
          {channelChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="avgRating" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No channel data available</p>
          )}
        </div>
      </div>

      {/* Recurring Issues Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recurring Issues Summary
        </h3>
        <div className="space-y-3">
          {recurringIssues.length > 0 ? (
            recurringIssues.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-500 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 capitalize block mb-1">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-600">
                    {item.lowRatingCount} review{item.lowRatingCount !== 1 ? "s" : ""} with low ratings
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-orange-700">
                    Avg: {item.avgRating.toFixed(1)}/10
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                      style={{ width: `${(item.avgRating / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium">No recurring issues identified</p>
              <p className="text-sm text-green-600 mt-1">All categories are performing well!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

