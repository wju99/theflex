export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: "guest-to-host" | "host-to-guest";
  status: "published" | "pending" | "rejected";
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface NormalizedReview {
  id: number;
  type: "guest-to-host" | "host-to-guest";
  status: "published" | "pending" | "rejected";
  rating: number | null;
  publicReview: string;
  reviewCategories: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel?: string;
  approvedForDisplay?: boolean;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}

