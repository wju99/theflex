# Flex Living Reviews Dashboard

A modern dashboard for managing and displaying guest reviews for Flex Living properties.

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Shadcn / Tailwind CSS** for styling
- **Supabase** for database (PostgreSQL)
- **Recharts** for data visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Endpoints

- `GET /api/reviews/hostaway` - Fetches and normalizes reviews from Hostaway API (uses mock data if API unavailable)
- `GET /api/reviews/approved?property={address}&approvedIds={ids}` - Fetches approved reviews for a property
- `GET /api/reviews/approved/save` - Retrieves all approved review IDs from database
- `POST /api/reviews/approved/save` - Saves approved review IDs to database

## Project Structure

```
theflex/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and API clients
├── types/                 # TypeScript types
└── data/                  # Mock data
```

## Environment Variables

Create a `.env.local` file in the root directory:

```

# Supabase (required for approved reviews persistence)
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

### Setting up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your **Project URL** and **anon/public key**
4. Add them to your `.env.local` file
5. Go to SQL Editor in Supabase dashboard
6. Run the SQL from `supabase-schema.sql` to create the `approved_reviews` table:
   ```sql
   CREATE TABLE IF NOT EXISTS approved_reviews (
     id SERIAL PRIMARY KEY,
     review_id INTEGER UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX IF NOT EXISTS idx_approved_reviews_review_id ON approved_reviews(review_id);
   
   ALTER TABLE approved_reviews ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Allow all operations on approved_reviews" ON approved_reviews
     FOR ALL
     USING (true)
     WITH CHECK (true);
   ```

**Note:** The app will fall back to localStorage if Supabase is not configured, but database persistence is recommended for production.

## Key Design and Logic Decisions

### Data Normalization
- All reviews from different sources (Hostaway, future Google Reviews) are normalized to a consistent `NormalizedReview` format
- Property addresses are parsed from listing names to group multiple listings (e.g., "2B N1 A - 29 Shoreditch Heights" → "29 Shoreditch Heights")
- Only guest reviews can be approved for public display (host reviews are excluded)

### Review Approval System
- Uses React Context (`ApprovedReviewsContext`) for global state management
- Persists approved reviews to Supabase database with localStorage fallback
- Real-time updates: when a review is approved in the dashboard, it automatically appears on property detail pages without refresh

### Property Identification
- Properties are identified by parsed addresses rather than listing names
- Multiple listings (different units/channels) for the same physical property are grouped together
- URL-friendly IDs are generated from addresses for routing (e.g., "29-shoreditch-heights")

### UI/UX Decisions
- Dark green theme color (`rgb(40, 78, 76)`) for brand consistency
- Rating bars show partial fills for decimal ratings (e.g., 4.3 shows 4 full bars + 30% of 5th bar)
- Color-coded ratings: green (4-5), orange (2-3), red (0-1)
- Channel logos (Airbnb, Booking.com, VRBO) displayed instead of text badges
- Summary statistics use ALL reviews, but only APPROVED reviews are displayed in full

### API Behaviors

#### Hostaway Reviews API
- Falls back to mock data if API is unavailable
- Normalizes review data to handle null ratings and missing categories
- Extracts channel information from listing names

#### Approved Reviews API
- `GET /api/reviews/approved?property={address}` - Returns all reviews for a property (for summary calculation)
- `GET /api/reviews/approved?property={address}&approvedIds={ids}` - Returns only approved reviews (for display)
- If `approvedIds` is not provided, returns all reviews for the property

#### Review Persistence
- Approved reviews are stored in Supabase `approved_reviews` table
- Client-side context syncs with database on mount
- Falls back to localStorage if database is unavailable

## Google Reviews Integration (Future Implementation)

To integrate Google Reviews into the dashboard, follow these steps:

### 1. Property Setup with Google Place IDs

- **For New Properties**: Use Google Places Autocomplete/Select input component when entering new properties. This will allow users to search and select the correct Google Place, automatically storing the Place ID.

- **For Existing Properties**: Add a migration to convert existing property rows in the database to include a `google_place_id` field. This can be done by:
  - Adding a `google_place_id` column to your properties table
  - Using Google Places Text Search API to find and map existing addresses to their Place IDs
  - Storing the Place IDs for future use

### 2. Fetching Google Reviews

- Use the stored Google Place IDs to fetch reviews using the Google Places API (Place Details endpoint)
- The API endpoint should accept a Place ID and return normalized review data
- Implement caching to minimize API calls and reduce costs

### 3. Display Google Reviews

- Create Google Review Cards with Google logo (similar to existing Airbnb/Booking.com/VRBO review cards)
- Normalize Google review data to match the existing `NormalizedReview` format
- Integrate Google reviews into the dashboard alongside Hostaway reviews
- Add "Google" as a filter option in the reviews section

### Implementation Notes

- Google Places API requires billing setup (free tier: $200/month credit)
- Rate limiting and caching should be implemented to optimize API usage
- Google reviews are typically limited to the 5 most recent reviews per place

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

