"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { PropertyImageGallery } from "@/components/PropertyImageGallery";
import { PropertyDetails } from "@/components/PropertyDetails";
import { PropertyAbout } from "@/components/PropertyAbout";
import { PropertyAmenities } from "@/components/PropertyAmenities";
import { PropertyStayPolicies } from "@/components/PropertyStayPolicies";
import { PropertyBookingWidget } from "@/components/PropertyBookingWidget";
import { PropertyReviewsSection } from "@/components/PropertyReviewsSection";
import { NormalizedReview } from "@/types/review";
import { getPropertyId, parsePropertyAddress, getPropertyUrlId } from "@/lib/utils/parseProperty";
import { useApprovedReviews } from "@/contexts/ApprovedReviewsContext";

// Helper to get property data from reviews
async function getPropertyData(propertyUrlId: string): Promise<any> {
  try {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    
    // Fetch reviews to find matching property
    const reviewsRes = await fetch(`${baseUrl}/api/reviews/hostaway`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!reviewsRes.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const reviewsData = await reviewsRes.json();
    const allReviews = reviewsData.reviews || [];
    
    // Find a review that matches this property URL ID
    const matchingReview = allReviews.find(
      (review: NormalizedReview) => getPropertyUrlId(review.listingName) === propertyUrlId
    );

    if (!matchingReview) {
      return null;
    }

    const address = parsePropertyAddress(matchingReview.listingName);
    
    // Hardcoded property images
    // Images are stored in: public/images/properties/
    const images = [
      "/images/properties/flex-image-1.jpeg",
      "/images/properties/flex-image-2.jpeg",
      "/images/properties/flex-image-3.jpeg",
      "/images/properties/flex-image-4.jpeg",
      "/images/properties/flex-image-5.jpeg",
    ];
    
    // Default property data - in production this would come from a property API
    return {
      id: propertyUrlId,
      title: `Beautiful Apartment - ${address} - The Flex London`,
      address: address,
      guests: 4,
      bedrooms: 1,
      bathrooms: 1,
      beds: 3,
      description:
        "This spacious apartment is in a great spot. It's close to shops, cafes, and transport. Inside, you'll find plenty of space and everything you need for a comfortable stay - a nice kitchen, cozy living area, and good Wi-Fi. I keep the place clean and tidy, so you can relax and enjoy your time in London. The location is perfect for exploring the city, with easy access to public transport and lots of great places to eat and drink nearby.",
      amenities: [
        "Cable TV",
        "Internet",
        "Wireless",
        "Kitchen",
        "Washing Machine",
        "Elevator",
        "Hair Dryer",
        "Heating",
        "Smoke Detector",
      ],
      images,
    };
  } catch (error) {
    console.error("Error fetching property data:", error);
    return null;
  }
}

async function fetchAllReviewsForProperty(
  propertyAddress: string
): Promise<NormalizedReview[]> {
  try {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${baseUrl}/api/reviews/approved?property=${encodeURIComponent(
      propertyAddress
    )}`;

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

async function fetchApprovedReviews(
  propertyAddress: string,
  approvedIds: number[]
): Promise<NormalizedReview[]> {
  try {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    // If no approved reviews, return empty array
    if (approvedIds.length === 0) {
      return [];
    }

    const approvedIdsParam = approvedIds.join(",");
    const url = `${baseUrl}/api/reviews/approved?property=${encodeURIComponent(
      propertyAddress
    )}&approvedIds=${encodeURIComponent(approvedIdsParam)}`;

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
    console.error("Error fetching approved reviews:", error);
    return [];
  }
}

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const propertyUrlId = params.id;
  const { approvedReviewIds } = useApprovedReviews();
  const approvedIdsArray = useMemo(() => Array.from(approvedReviewIds), [approvedReviewIds]);

  // Fetch property data
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ["property", propertyUrlId],
    queryFn: () => getPropertyData(propertyUrlId),
    enabled: !!propertyUrlId,
  });

  // Fetch all reviews for the property (for summary calculation)
  const { data: allReviews = [] } = useQuery({
    queryKey: ["allReviews", property?.address],
    queryFn: () => fetchAllReviewsForProperty(property?.address || ""),
    enabled: !!property?.address,
  });

  // Fetch only approved reviews (for display) - refetch when approvedReviewIds changes
  const { data: approvedReviews = [] } = useQuery({
    queryKey: ["approvedReviews", property?.address, approvedIdsArray],
    queryFn: () => fetchApprovedReviews(property?.address || "", approvedIdsArray),
    enabled: !!property?.address,
  });



  if (propertyLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4d3a]"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600">The property you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Full width images section */}
          <div className="mb-8">
            <PropertyImageGallery images={property.images} />
          </div>

          {/* Full width property title/details */}
          <div className="mb-8">
            <PropertyDetails
              title={property.title}
              address={property.address}
              guests={property.guests}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              beds={property.beds}
            />
          </div>

          {/* Content with booking widget on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <PropertyAbout description={property.description} />
              <PropertyAmenities amenities={property.amenities} />
              <PropertyStayPolicies />
              <PropertyReviewsSection
                allReviews={allReviews}
                approvedReviews={approvedReviews}
                propertyAddress={property.address}
              />
            </div>

            {/* Right Column - Sticky Booking Widget */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <PropertyBookingWidget />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>
  );
}

