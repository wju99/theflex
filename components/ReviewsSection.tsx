"use client";

import { useState, useMemo } from "react";
import { ReviewFilters } from "./ReviewFilters";
import { ReviewCard } from "./ReviewCard";
import {
  filterAndSortReviews,
  FilterOptions,
  SortOption,
} from "@/lib/utils/filterReviews";
import { NormalizedReview } from "@/types/review";

interface ReviewsSectionProps {
  reviews: NormalizedReview[];
  selectedReviews: Set<number>;
  onSelectReview: (id: number, selected: boolean) => void;
  channels: string[];
  categories: string[];
}

export function ReviewsSection({
  reviews,
  selectedReviews,
  onSelectReview,
  channels,
  categories,
}: ReviewsSectionProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    rating: null,
    channel: null,
    category: null,
    dateRange: null,
    search: "",
  });
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredReviews = useMemo(() => {
    return filterAndSortReviews(reviews, filters, sortBy);
  }, [reviews, filters, sortBy]);

  const handleSelectAll = () => {
    // Only consider guest reviews for selection
    const guestReviews = filteredReviews.filter((r) => r.type === "guest-to-host");
    const selectedGuestReviews = guestReviews.filter((r) => selectedReviews.has(r.id));
    
    if (selectedGuestReviews.length === guestReviews.length) {
      // Deselect all guest reviews
      guestReviews.forEach((r) => onSelectReview(r.id, false));
    } else {
      // Select all guest reviews
      guestReviews.forEach((r) => onSelectReview(r.id, true));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ReviewFilters
        filters={filters}
        onFilterChange={setFilters}
        channels={channels}
        categories={categories}
      />

      {/* Sort and Selection Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d3a] focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
              <option value="property-asc">Property (A-Z)</option>
              <option value="property-desc">Property (Z-A)</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </span>
            {filteredReviews.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-[#1a4d3a] hover:text-[#2d6b4f] font-medium"
              >
                {(() => {
                  const guestReviews = filteredReviews.filter((r) => r.type === "guest-to-host");
                  const selectedGuestReviews = guestReviews.filter((r) => selectedReviews.has(r.id));
                  return selectedGuestReviews.length === guestReviews.length && guestReviews.length > 0
                    ? "Deselect All"
                    : "Select All";
                })()}
              </button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isSelected={selectedReviews.has(review.id)}
                onSelect={onSelectReview}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                No reviews match your filters
              </p>
              <button
                onClick={() =>
                  setFilters({
                    rating: null,
                    channel: null,
                    category: null,
                    dateRange: null,
                    search: "",
                  })
                }
                className="text-sm text-[#1a4d3a] hover:text-[#2d6b4f] font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

