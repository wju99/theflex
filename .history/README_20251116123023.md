# Flex Living Reviews Dashboard

A modern dashboard for managing and displaying guest reviews for Flex Living properties.

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Prisma** (to be configured) for database
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
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
```

**Note:** The app will use default values if these are not set, but it's recommended to create the `.env.local` file for proper configuration.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

