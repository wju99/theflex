"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface ApprovedReviewsContextType {
  approvedReviewIds: Set<number>;
  approveReview: (id: number) => void;
  unapproveReview: (id: number) => void;
  isApproved: (id: number) => boolean;
  isLoading: boolean;
}

const ApprovedReviewsContext = createContext<ApprovedReviewsContextType | undefined>(undefined);

export function ApprovedReviewsProvider({ children }: { children: ReactNode }) {
  const [approvedReviewIds, setApprovedReviewIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load from database on mount
  useEffect(() => {
    async function loadApprovedReviews() {
      try {
        const response = await fetch("/api/reviews/approved/save");
        if (response.ok) {
          const data = await response.json();
          setApprovedReviewIds(new Set(data.reviewIds || []));
        } else {
          // Fallback to localStorage if database fails
          if (typeof window !== "undefined") {
            const saved = localStorage.getItem("selectedReviews");
            if (saved) {
              try {
                const savedIds = JSON.parse(saved);
                setApprovedReviewIds(new Set(savedIds));
              } catch (e) {
                console.error("Error loading from localStorage:", e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading approved reviews:", error);
        // Fallback to localStorage
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("selectedReviews");
          if (saved) {
            try {
              const savedIds = JSON.parse(saved);
              setApprovedReviewIds(new Set(savedIds));
            } catch (e) {
              console.error("Error loading from localStorage:", e);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadApprovedReviews();
  }, []);

  // Save to database whenever approvedReviewIds changes (debounced)
  useEffect(() => {
    if (isLoading) return; // Don't save on initial load

    const timeoutId = setTimeout(async () => {
      try {
        const reviewIdsArray = Array.from(approvedReviewIds);
        const response = await fetch("/api/reviews/approved/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewIds: reviewIdsArray }),
        });

        if (!response.ok) {
          console.error("Failed to save to database, using localStorage fallback");
          // Fallback to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "selectedReviews",
              JSON.stringify(reviewIdsArray)
            );
          }
        } else {
          // Also save to localStorage as backup
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "selectedReviews",
              JSON.stringify(reviewIdsArray)
            );
          }
        }
      } catch (error) {
        console.error("Error saving approved reviews:", error);
        // Fallback to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "selectedReviews",
            JSON.stringify(Array.from(approvedReviewIds))
          );
        }
      }
    }, 500); // Debounce by 500ms

    return () => clearTimeout(timeoutId);
  }, [approvedReviewIds, isLoading]);

  const approveReview = useCallback((id: number) => {
    setApprovedReviewIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const unapproveReview = useCallback((id: number) => {
    setApprovedReviewIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const isApproved = useCallback((id: number) => {
    return approvedReviewIds.has(id);
  }, [approvedReviewIds]);

  return (
    <ApprovedReviewsContext.Provider
      value={{
        approvedReviewIds,
        approveReview,
        unapproveReview,
        isApproved,
        isLoading,
      }}
    >
      {children}
    </ApprovedReviewsContext.Provider>
  );
}

export function useApprovedReviews() {
  const context = useContext(ApprovedReviewsContext);
  if (context === undefined) {
    throw new Error("useApprovedReviews must be used within an ApprovedReviewsProvider");
  }
  return context;
}

