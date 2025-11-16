"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { DashboardTabs } from "@/components/DashboardTabs";
import { DashboardOverview } from "@/components/DashboardOverview";
import { PropertyPerformance } from "@/components/PropertyPerformance";
import { ReviewsSection } from "@/components/ReviewsSection";
import { TrendsAnalysis } from "@/components/TrendsAnalysis";
import { NormalizedReview } from "@/types/review";
import { useApprovedReviews } from "@/contexts/ApprovedReviewsContext";

async function fetchReviews(): Promise<NormalizedReview[]> {
  try {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${baseUrl}/api/reviews/hostaway`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch reviews: ${res.status}`
      );
    }
    const data = await res.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { approvedReviewIds, approveReview, unapproveReview } = useApprovedReviews();

  const { data: reviews = [], isLoading, error, isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    retry: 2,
    retryDelay: 1000,
  });

  // Filter out host reviews from approved reviews on load
  useEffect(() => {
    if (reviews.length > 0) {
      const guestReviewIds = new Set(
        reviews
          .filter((r) => r.type === "guest-to-host")
          .map((r) => r.id)
      );
      
      // Remove any host reviews that might be in approved reviews
      approvedReviewIds.forEach((id) => {
        if (!guestReviewIds.has(id)) {
          unapproveReview(id);
        }
      });
    }
  }, [reviews, approvedReviewIds, unapproveReview]);

  // Extract unique channels and categories
  const channels = useMemo(() => {
    const channelSet = new Set<string>();
    reviews.forEach((r) => {
      if (r.channel) channelSet.add(r.channel);
    });
    return Array.from(channelSet).sort();
  }, [reviews]);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    reviews.forEach((r) => {
      r.reviewCategories?.forEach((cat) => categorySet.add(cat.category));
    });
    return Array.from(categorySet).sort();
  }, [reviews]);

  const handleSelectReview = (id: number, selected: boolean) => {
    // Only allow guest reviews to be selected
    const review = reviews.find((r) => r.id === id);
    if (review && review.type !== "guest-to-host" && selected) {
      // Prevent host reviews from being selected
      return;
    }
    
    if (selected) {
      approveReview(id);
    } else {
      unapproveReview(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f5f1eb]">
        <div className="text-center">
          <div className="text-xl text-gray-700 mb-2">Loading reviews...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4d3a] mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f5f1eb]">
        <div className="text-center max-w-md">
          <div className="text-xl text-red-600 mb-2">
            Error loading reviews
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "Unknown error occurred"}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1a4d3a] text-white rounded-lg hover:bg-[#2d6b4f] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <DashboardOverview
            reviews={reviews}
            approvedCount={approvedReviewIds.size}
            onNavigateToTab={setActiveTab}
          />
        );
      case "properties":
        return <PropertyPerformance reviews={reviews} />;
      case "reviews":
        return (
          <ReviewsSection
            reviews={reviews}
            selectedReviews={approvedReviewIds}
            onSelectReview={handleSelectReview}
            channels={channels}
            categories={categories}
          />
        );
      case "trends":
        return <TrendsAnalysis reviews={reviews} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and review guest feedback for your properties
            </p>
          </div>

          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {renderTabContent()}
        </div>
      </main>
  );
}
