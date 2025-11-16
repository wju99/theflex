"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { NormalizedReview } from "@/types/review";
import { getPropertyId, getPropertyUrlId, parsePropertyAddress } from "@/lib/utils/parseProperty";
import Link from "next/link";

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
      throw new Error("Failed to fetch reviews");
    }

    const data = await res.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export default function PropertiesPage() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  // Group reviews by property
  const properties = new Map<string, {
    address: string;
    urlId: string;
    reviewCount: number;
    averageRating: number;
    ratingSum: number;
    ratingCount: number;
  }>();

  reviews.forEach((review) => {
    const propertyId = getPropertyId(review.listingName);
    const address = parsePropertyAddress(review.listingName);
    const urlId = getPropertyUrlId(review.listingName);

    if (!properties.has(propertyId)) {
      properties.set(propertyId, {
        address,
        urlId,
        reviewCount: 0,
        averageRating: 0,
        ratingSum: 0,
        ratingCount: 0,
      });
    }

    const property = properties.get(propertyId)!;
    property.reviewCount += 1;
    
    // Only include reviews with actual ratings in the average calculation
    if (review.rating !== null && review.rating !== undefined) {
      property.ratingCount += 1;
      property.ratingSum += review.rating;
      property.averageRating = property.ratingSum / property.ratingCount;
    }
  });

  const propertiesList = Array.from(properties.values());

  return (
    <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4d3a]"></div>
            </div>
          ) : propertiesList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No properties found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesList.map((property, index) => {
                // Use preset images from images/properties folder
                // Cycle through the 5 available images
                const imageIndex = (index % 5) + 1;
                const propertyImage = `/images/properties/flex-image-${imageIndex}.jpeg`;
                
                return (
                  <Link
                    key={property.urlId}
                    href={`/properties/${property.urlId}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden block"
                  >
                    {/* Property Image */}
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={propertyImage}
                        alt={property.address}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        {property.address}
                      </h2>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {property.reviewCount} review{property.reviewCount !== 1 ? "s" : ""}
                        </span>
                        {property.averageRating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-[#1a4d3a]">
                              {property.averageRating.toFixed(1)}
                            </span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= Math.round(property.averageRating)
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
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-[#1a4d3a] font-medium mt-4">
                        View Details →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
  );
}

