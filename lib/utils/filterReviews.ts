import { NormalizedReview } from "@/types/review";

export interface FilterOptions {
  rating: number | null;
  channel: string | null;
  category: string | null;
  dateRange: string | null;
  search: string;
}

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "rating-desc"
  | "rating-asc"
  | "property-asc"
  | "property-desc";

export function filterAndSortReviews(
  reviews: NormalizedReview[],
  filters: FilterOptions,
  sortBy: SortOption = "date-desc"
): NormalizedReview[] {
  let filtered = [...reviews];

  // Apply filters
  if (filters.rating) {
    filtered = filtered.filter(
      (r) => r.rating && r.rating >= filters.rating!
    );
  }

  if (filters.channel) {
    filtered = filtered.filter((r) => r.channel === filters.channel);
  }

  if (filters.dateRange) {
    const days = Number(filters.dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    filtered = filtered.filter(
      (r) => new Date(r.submittedAt) >= cutoffDate
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.publicReview.toLowerCase().includes(searchLower) ||
        r.guestName.toLowerCase().includes(searchLower) ||
        r.listingName.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case "date-asc":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case "rating-desc":
        return (b.rating || 0) - (a.rating || 0);
      case "rating-asc":
        return (a.rating || 0) - (b.rating || 0);
      case "property-asc":
        return a.listingName.localeCompare(b.listingName);
      case "property-desc":
        return b.listingName.localeCompare(a.listingName);
      default:
        return 0;
    }
  });

  return filtered;
}

