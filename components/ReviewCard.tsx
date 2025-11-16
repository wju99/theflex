"use client";

import Image from "next/image";
import Link from "next/link";
import { parsePropertyAddress, parseUnitInfo, getPropertyUrlId } from "@/lib/utils/parseProperty";

interface ReviewCardProps {
  review: any;
  isSelected: boolean;
  onSelect: (id: number, selected: boolean) => void;
}

export function ReviewCard({ review, isSelected, onSelect }: ReviewCardProps) {
  return (
    <div
      className={`border rounded-lg p-6 hover:shadow-lg transition-all bg-white relative ${
        isSelected
          ? "border-[#1a4d3a] border-2 shadow-sm bg-[#f5f1eb]"
          : "border-gray-200"
      }`}
    >
      {/* Review Type Badge - Top Left */}
      <div className={`absolute left-4 ${isSelected ? "top-12" : "top-4"}`}>
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
            review.type === "guest-to-host"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {review.type === "guest-to-host" ? "Guest Review" : "Host Review"}
        </span>
      </div>

      {/* Subtle Selection Indicator */}
      {isSelected && (
        <div className="mb-4 -mx-6 -mt-6 bg-[#1a4d3a] text-white px-4 py-1.5 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs font-medium">
                Approved for Display
              </span>
            </div>
            <button
              onClick={() => onSelect(review.id, false)}
              className="text-xs hover:underline opacity-80 hover:opacity-100 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Rating - Top Right (aligned with badge) */}
      <div className={`absolute right-4 ${isSelected ? "top-12" : "top-4"}`}>
        {review.rating !== null && review.rating !== undefined ? (
          <div className="flex items-center gap-1">
            <span
              className={`text-3xl font-bold ${
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
        ) : (
          <div>
            <span className="inline-block text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full font-medium">
              No Rating
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-4 pt-8">
        <div className="flex-1">
          <Link
            href={`/properties/${getPropertyUrlId(review.listingName)}`}
            className="font-semibold text-lg text-gray-900 mb-1 hover:text-[#1a4d3a] transition-colors block"
          >
            {parsePropertyAddress(review.listingName)}
          </Link>
          {parseUnitInfo(review.listingName) && (
            <p className="text-xs text-gray-500 mb-2">
              {parseUnitInfo(review.listingName)}
            </p>
          )}
          <p className="text-sm text-gray-600 mb-1">Guest: {review.guestName}</p>
          <p className="text-xs text-gray-500 mb-2">
            {new Date(review.submittedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">{review.publicReview}</p>
      {review.reviewCategories && review.reviewCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {review.reviewCategories.map((cat: any, idx: number) => (
            <span
              key={idx}
              className="text-xs bg-[#f5f1eb] text-gray-700 px-3 py-1.5 rounded-full font-medium capitalize"
            >
              {cat.category.replace(/_/g, " ")}: {cat.rating}/10
            </span>
          ))}
        </div>
      )}

      {/* Channel Logo and Selection Toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        {/* Channel Logo - Bottom Left */}
        {review.channel && (
          <div className="flex items-center">
            {review.channel.toLowerCase().includes("airbnb") && (
              <Image
                src="/airbnb-logo.png"
                alt="Airbnb"
                width={60}
                height={20}
                className="h-7 w-auto opacity-70 object-contain"
              />
            )}
            {review.channel.toLowerCase().includes("booking") && (
              <Image
                src="/booking-logo.png"
                alt="Booking.com"
                width={80}
                height={20}
                className="h-5 w-auto opacity-70 object-contain"
              />
            )}
            {review.channel.toLowerCase().includes("vrbo") && (
              <Image
                src="/vrbo-logo.png"
                alt="VRBO"
                width={50}
                height={20}
                className="h-5 w-auto opacity-70 object-contain"
              />
            )}
          </div>
        )}
        {!review.channel && <div></div>}
        {/* Selection Toggle - Bottom Right */}
        {/* Only allow guest reviews to be approved for display */}
        {review.type === "guest-to-host" ? (
          <div className="flex justify-end">
            <button
              onClick={() => onSelect(review.id, !isSelected)}
              className={`py-2.5 px-4 rounded-md text-xs font-medium transition-all ${
                isSelected
                  ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  : "bg-[#1a4d3a] text-white hover:bg-[#2d6b4f]"
              }`}
            >
              {isSelected ? (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Remove from Display</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Approve for Display</span>
                </div>
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <span className="text-xs text-gray-500 italic py-2.5 px-4">
              Host reviews cannot be approved
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
