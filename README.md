# Flex Living Reviews Dashboard

A modern dashboard for managing and displaying guest reviews for Flex Living properties.

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **React Query** for data fetching
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
# Hostaway API (optional - defaults provided)
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152

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

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

