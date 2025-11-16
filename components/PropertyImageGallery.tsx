"use client";

import Image from "next/image";

interface PropertyImageGalleryProps {
  images: string[];
}

export function PropertyImageGallery({ images }: PropertyImageGalleryProps) {
  // Default placeholder - update this path if you have a default placeholder image
  const defaultPlaceholder = "/images/properties/placeholder.jpg";
  const mainImage = images[0] || defaultPlaceholder;
  const thumbnails = images.slice(1, 5);

  return (
    <div className="grid grid-cols-2 gap-2 mb-8" style={{ minHeight: "600px" }}>
      {/* Main large image on the left */}
      <div className="row-span-2">
        <div className="h-full rounded-lg overflow-hidden bg-gray-200 relative" style={{ minHeight: "600px" }}>
          <Image
            src={mainImage}
            alt="Property main view"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("placeholder")) {
                target.src = defaultPlaceholder;
              }
            }}
          />
        </div>
      </div>
      
      {/* Right side: 2x2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {thumbnails.slice(0, 4).map((img, idx) => (
          <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative">
            {idx === 3 && thumbnails.length >= 4 ? (
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`Property view ${idx + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("placeholder")) {
                      target.src = defaultPlaceholder;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                    View all photos
                  </button>
                </div>
              </div>
            ) : (
              <Image
                src={img}
                alt={`Property view ${idx + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("placeholder")) {
                    target.src = defaultPlaceholder;
                  }
                }}
              />
            )}
          </div>
        ))}
        {thumbnails.length < 4 && (
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative">
            {thumbnails.length === 3 && (
              <>
                <Image
                  src={thumbnails[2]}
                  alt="Property view 4"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("placeholder")) {
                      target.src = defaultPlaceholder;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                    View all photos
                  </button>
                </div>
              </>
            )}
            {thumbnails.length < 3 && (
              <button className="w-full h-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center text-sm font-medium text-gray-700">
                View all photos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

