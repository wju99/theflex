"use client";

interface ReviewFiltersProps {
  filters: {
    rating: number | null;
    channel: string | null;
    category: string | null;
    dateRange: string | null;
    search: string;
  };
  onFilterChange: (filters: {
    rating: number | null;
    channel: string | null;
    category: string | null;
    dateRange: string | null;
    search: string;
  }) => void;
  channels: string[];
  categories: string[];
}

export function ReviewFilters({
  filters,
  onFilterChange,
  channels,
  categories,
}: ReviewFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search reviews..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d3a] focus:border-transparent"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Rating
          </label>
          <select
            value={filters.rating || ""}
            onChange={(e) =>
              updateFilter("rating", e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d3a] focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel
          </label>
          <select
            value={filters.channel || ""}
            onChange={(e) => updateFilter("channel", e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d3a] focus:border-transparent"
          >
            <option value="">All Channels</option>
            {channels.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange || ""}
            onChange={(e) => updateFilter("dateRange", e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d3a] focus:border-transparent"
          >
            <option value="">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.rating ||
        filters.channel ||
        filters.dateRange ||
        filters.search) && (
        <button
          onClick={() =>
            onFilterChange({
              rating: null,
              channel: null,
              category: null,
              dateRange: null,
              search: "",
            })
          }
          className="mt-4 text-sm text-[#1a4d3a] hover:text-[#2d6b4f] font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

