import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { reviewIds } = await request.json();

    if (!Array.isArray(reviewIds)) {
      return NextResponse.json(
        { error: "reviewIds must be an array" },
        { status: 400 }
      );
    }

    // Get current approved reviews
    const { data: currentApproved, error: fetchError } = await supabase
      .from("approved_reviews")
      .select("review_id");

    if (fetchError) {
      throw fetchError;
    }

    const currentIds = new Set(
      (currentApproved || []).map((r) => r.review_id)
    );
    const newIds = new Set(reviewIds);

    // Add new approvals
    const toAdd = reviewIds.filter((id) => !currentIds.has(id));
    if (toAdd.length > 0) {
      const { error: insertError } = await supabase
        .from("approved_reviews")
        .upsert(
          toAdd.map((id) => ({ review_id: id })),
          { onConflict: "review_id" }
        );

      if (insertError) {
        throw insertError;
      }
    }

    // Remove unapproved reviews
    const toRemove = Array.from(currentIds).filter((id) => !newIds.has(id));
    if (toRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from("approved_reviews")
        .delete()
        .in("review_id", toRemove);

      if (deleteError) {
        throw deleteError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving approved reviews:", error);
    return NextResponse.json(
      {
        error: "Failed to save approved reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: approvedReviews, error } = await supabase
      .from("approved_reviews")
      .select("review_id");

    if (error) {
      throw error;
    }

    return NextResponse.json({
      reviewIds: (approvedReviews || []).map((r) => r.review_id),
    });
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch approved reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
