"use client";

import { useState } from "react";

interface PropertyAboutProps {
  description: string;
}

export function PropertyAbout({ description }: PropertyAboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncated = description.length > 200;
  const displayText = isExpanded || !truncated ? description : description.slice(0, 200) + "...";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
      <p className="text-gray-700 leading-relaxed mb-4">{displayText}</p>
      {truncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#1a4d3a] hover:text-[#2d6b4f] font-medium text-sm"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

