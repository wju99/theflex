"use client";

interface PropertyAmenitiesProps {
  amenities: string[];
}

const amenityIcons: Record<string, string> = {
  "Cable TV": "📺",
  "Internet": "🌐",
  "Wireless": "📶",
  "Kitchen": "🍳",
  "Washing Machine": "🧺",
  "Elevator": "🛗",
  "Hair Dryer": "💨",
  "Heating": "🔥",
  "Smoke Detector": "🚨",
};

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  const displayed = amenities.slice(0, 9);
  const remaining = amenities.length - displayed.length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
        {remaining > 0 && (
          <button className="text-[#1a4d3a] hover:text-[#2d6b4f] text-sm font-medium">
            View all amenities &gt;
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayed.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-2xl">{amenityIcons[amenity] || "✓"}</span>
            <span className="text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

