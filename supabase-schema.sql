-- Run this SQL in your Supabase SQL Editor to create the approved_reviews table

CREATE TABLE IF NOT EXISTS approved_reviews (
  id SERIAL PRIMARY KEY,
  review_id INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on review_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_approved_reviews_review_id ON approved_reviews(review_id);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE approved_reviews ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on approved_reviews" ON approved_reviews
  FOR ALL
  USING (true)
  WITH CHECK (true);

