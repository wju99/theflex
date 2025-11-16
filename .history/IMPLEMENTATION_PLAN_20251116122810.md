# Flex Living Reviews Dashboard - Implementation Plan

## 1. Tech Stack Recommendations

### Frontend
**Recommended: Next.js 14+ (App Router) with TypeScript**
- **Rationale:**
  - Server-side rendering for better SEO (important for public review pages)
  - Built-in API routes for backend integration
  - Excellent TypeScript support
  - Modern React patterns with Server Components
  - Easy deployment to Vercel/other platforms

**Alternative Options:**
- **React + Vite**: Lighter weight, faster dev experience, but requires separate backend
- **Remix**: Great for data loading patterns, but smaller ecosystem
- **SvelteKit**: Modern and performant, but less common in enterprise

**UI Framework:**
- **Tailwind CSS + shadcn/ui**: Modern, customizable, component-based
- **Material-UI (MUI)**: More components out-of-the-box, but heavier
- **Chakra UI**: Good middle ground

**State Management:**
- **React Query (TanStack Query)**: For server state (API data)
- **Zustand or Context API**: For client-side UI state (filters, selections)

**Data Visualization:**
- **Recharts** or **Chart.js**: For trend analysis and performance metrics

### Backend
**Recommended: Node.js/Express or Next.js API Routes**
- Since we're using Next.js, **Next.js API Routes** is the natural choice
- Handles Hostaway API integration
- Data normalization and transformation
- Review approval/selection state management

**Database (for storing review selections):**
- **PostgreSQL** (via Supabase, Neon, or Railway): For production
- **SQLite** (via Prisma): For development/simple deployments
- **No Database**: If selections stored in localStorage (not recommended for multi-user)

**ORM:**
- **Prisma**: Type-safe, excellent DX, works with multiple databases

### Authentication (if needed)
- **NextAuth.js**: If multi-user manager access required
- **Simple API key**: If single-user or internal tool

### Testing
- **Vitest**: Fast unit testing
- **Playwright**: E2E testing for critical flows
- **React Testing Library**: Component testing

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│  Manager Dashboard          │  Public Review Page       │
│  - Filter/Sort Reviews      │  - Display Approved       │
│  - Select for Display       │  - Property Details       │
│  - Trend Analysis           │  - Review Cards           │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              API Routes (Next.js Backend)                │
├─────────────────────────────────────────────────────────┤
│  GET /api/reviews/hostaway  │  POST /api/reviews/select │
│  GET /api/reviews/approved  │  GET /api/reviews/stats   │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────────┐                  ┌──────────────────┐
│  Hostaway API     │                  │  Database        │
│  (Mocked Data)    │                  │  (Selections)    │
└───────────────────┘                  └──────────────────┘
```

---

## 3. Implementation Phases

### Phase 1: Foundation & API Integration (Days 1-2)
**Goals:**
- Set up Next.js project with TypeScript
- Create API route for Hostaway integration
- Implement data normalization logic
- Mock review data integration
- Basic error handling

**Deliverables:**
- `/api/reviews/hostaway` endpoint returning normalized data
- TypeScript types for review data
- Data transformation utilities

### Phase 2: Manager Dashboard Core (Days 3-4)
**Goals:**
- Build dashboard layout
- Implement review listing with filters
- Add sorting capabilities
- Basic UI components

**Deliverables:**
- Dashboard page with review table/list
- Filter by: rating, category, channel, date range
- Sort by: date, rating, property
- Responsive design

### Phase 3: Dashboard Advanced Features (Days 5-6)
**Goals:**
- Review selection/approval system
- Trend visualization (charts)
- Performance metrics per property
- Search functionality

**Deliverables:**
- Checkbox/selection UI for reviews
- Charts showing rating trends over time
- Property performance comparison
- Search by guest name, property, review text

### Phase 4: Public Review Display (Days 7-8)
**Goals:**
- Replicate Flex Living property page layout
- Add reviews section
- Display only approved reviews
- Ensure responsive, accessible design

**Deliverables:**
- Property detail page template
- Review cards component
- API endpoint for fetching approved reviews
- Styling consistent with Flex Living brand

### Phase 5: Google Reviews Exploration (Day 9)
**Goals:**
- Research Google Places API integration
- Test feasibility
- Document findings
- Implement basic integration if possible

**Deliverables:**
- Documentation of Google Reviews findings
- Basic integration (if feasible) or detailed explanation of blockers

### Phase 6: Polish & Documentation (Day 10)
**Goals:**
- Code cleanup and optimization
- Error handling improvements
- Write documentation
- Setup instructions
- Testing

**Deliverables:**
- Complete documentation (tech stack, decisions, API behaviors)
- Local setup instructions
- README with running instructions

---

## 4. Data Models

### Review (Normalized)
```typescript
interface Review {
  id: number;
  type: 'guest-to-host' | 'host-to-guest';
  status: 'published' | 'pending' | 'rejected';
  rating: number | null; // Overall rating
  publicReview: string;
  reviewCategories: {
    category: string; // cleanliness, communication, etc.
    rating: number;
  }[];
  submittedAt: string; // ISO date
  guestName: string;
  listingName: string;
  channel?: string; // Airbnb, Booking.com, etc.
  approvedForDisplay: boolean; // Manager selection
}
```

### Review Selection (Database)
```typescript
interface ReviewSelection {
  reviewId: number;
  approved: boolean;
  approvedAt: string;
  approvedBy?: string; // If multi-user
}
```

---

## 5. Key API Endpoints

### `GET /api/reviews/hostaway`
- Fetches reviews from Hostaway API (mocked)
- Normalizes data structure
- Returns array of Review objects

**Response:**
```json
{
  "reviews": Review[],
  "total": number,
  "lastFetched": string
}
```

### `GET /api/reviews/approved`
- Returns only reviews approved for public display
- Filtered by property/listing if needed

### `POST /api/reviews/select`
- Updates approval status for reviews
- Body: `{ reviewId: number, approved: boolean }`

### `GET /api/reviews/stats`
- Returns aggregated statistics
- Per-property ratings, trends, category breakdowns

---

## 6. Deployment Options

### Option 1: Vercel (Recommended for Next.js)
**Pros:**
- Zero-config deployment for Next.js
- Automatic HTTPS
- Edge functions support
- Free tier available
- Easy CI/CD with GitHub

**Cons:**
- Serverless functions have execution time limits
- Database needs separate hosting

**Setup:**
- Connect GitHub repo
- Add environment variables (API keys)
- Deploy automatically on push

**Database Options:**
- Supabase (PostgreSQL, free tier)
- Neon (serverless PostgreSQL)
- Railway (PostgreSQL)

### Option 2: Railway
**Pros:**
- Full-stack deployment (app + database)
- Simple setup
- Good free tier
- Built-in PostgreSQL

**Cons:**
- Less optimized for Next.js than Vercel
- Smaller ecosystem

### Option 3: Render
**Pros:**
- Free tier available
- PostgreSQL included
- Simple deployment
- Good for full-stack apps

**Cons:**
- Free tier spins down after inactivity
- Slower cold starts

### Option 4: Docker + Cloud Provider
**Pros:**
- Full control
- Works with any cloud (AWS, GCP, Azure)
- Scalable

**Cons:**
- More complex setup
- Requires infrastructure knowledge
- Higher cost

**Recommended Stack:**
- **Frontend + API**: Vercel
- **Database**: Supabase or Neon
- **Total Cost**: Free tier sufficient for MVP

---

## 7. Google Reviews Integration - Research Plan

### Approach
1. **Google Places API (New)**
   - Requires Google Cloud account
   - Places API (New) has Reviews endpoint
   - Cost: ~$0.017 per request
   - Requires place_id for each property

2. **Challenges:**
   - Need to map Flex Living properties to Google Place IDs
   - API requires authentication (API key)
   - Rate limits apply
   - Reviews may not be available for all properties

3. **Implementation Strategy:**
   - Create mapping table: `propertyName -> googlePlaceId`
   - Add API route: `GET /api/reviews/google?placeId=xxx`
   - Fetch and normalize Google review format
   - Merge with Hostaway reviews in dashboard

4. **Fallback:**
   - If API access is restricted or too complex, document:
     - Required setup steps
     - Cost considerations
     - Alternative approaches (embedding, manual import)

---

## 8. Design Considerations

### Dashboard UI/UX
- **Layout**: Sidebar navigation + main content area
- **Review List**: Card-based or table view (toggle option)
- **Filters**: Collapsible sidebar or top bar
- **Charts**: Dashboard overview with key metrics
- **Selection**: Bulk actions for approving/rejecting multiple reviews
- **Search**: Global search bar with autocomplete

### Public Review Page
- **Layout**: Match Flex Living property page structure
- **Reviews Section**: 
  - Star rating summary
  - Category breakdown
  - Individual review cards with:
    - Guest name (or "Verified Guest")
    - Date
    - Rating
    - Review text
    - Category ratings (if available)
- **Pagination**: Load more or infinite scroll

### Responsive Design
- Mobile-first approach
- Dashboard: Collapsible sidebar on mobile
- Review cards: Stack vertically on mobile
- Touch-friendly filter controls

---

## 9. Technical Decisions

### Data Normalization
- Transform Hostaway API response to consistent format
- Handle missing fields gracefully (null ratings, etc.)
- Parse dates consistently (ISO format)
- Extract channel from listing name or API metadata if available

### State Management
- **Server State**: React Query for API data
- **Client State**: 
  - URL params for filters (shareable/bookmarkable)
  - Local state for UI (modals, dropdowns)
  - Database for review selections (persistent)

### Performance
- **Caching**: React Query default caching
- **Pagination**: Implement for large review lists
- **Lazy Loading**: Load reviews on demand
- **Image Optimization**: Next.js Image component if review images exist

### Security
- **API Keys**: Store in environment variables
- **CORS**: Configure for public API endpoints
- **Rate Limiting**: Implement for API routes (if needed)

---

## 10. Project Structure

```
theflex/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Manager dashboard
│   │   └── layout.tsx
│   ├── (public)/
│   │   ├── properties/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Public property page
│   │   └── layout.tsx
│   ├── api/
│   │   └── reviews/
│   │       ├── hostaway/
│   │       │   └── route.ts      # Hostaway API integration
│   │       ├── approved/
│   │       │   └── route.ts      # Approved reviews endpoint
│   │       ├── select/
│   │       │   └── route.ts      # Review selection endpoint
│   │       └── stats/
│   │           └── route.ts     # Statistics endpoint
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   │   ├── ReviewList.tsx
│   │   ├── ReviewFilters.tsx
│   │   ├── ReviewStats.tsx
│   │   └── TrendChart.tsx
│   ├── reviews/
│   │   ├── ReviewCard.tsx
│   │   └── ReviewSummary.tsx
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api/
│   │   └── hostaway.ts           # Hostaway API client
│   ├── utils/
│   │   ├── normalize.ts          # Data normalization
│   │   └── format.ts             # Date/rating formatters
│   └── db/
│       └── client.ts             # Database client
├── types/
│   └── review.ts                 # TypeScript types
├── data/
│   └── mock-reviews.json         # Mock review data
├── prisma/
│   └── schema.prisma             # Database schema
├── public/
└── README.md
```

---

## 11. Success Metrics

### Functional Requirements
- ✅ Fetch and normalize Hostaway reviews
- ✅ Dashboard with filtering/sorting
- ✅ Review selection/approval system
- ✅ Public review display page
- ✅ Google Reviews research/implementation

### Quality Metrics
- Code follows TypeScript best practices
- Responsive design works on mobile/tablet/desktop
- API endpoints return consistent, well-structured data
- Error handling for API failures
- Loading states for async operations

---

## 12. Next Steps

1. **Initialize Project**
   ```bash
   npx create-next-app@latest theflex --typescript --tailwind --app
   cd theflex
   npm install @tanstack/react-query prisma @prisma/client
   npm install -D @types/node
   ```

2. **Set Up Database**
   - Choose database provider (Supabase recommended)
   - Initialize Prisma
   - Create schema for review selections

3. **Create API Route**
   - Implement `/api/reviews/hostaway`
   - Add mock data integration
   - Test normalization logic

4. **Build Dashboard**
   - Create dashboard layout
   - Implement review list component
   - Add filtering/sorting

5. **Implement Selection System**
   - Add database operations
   - Create selection UI
   - Test persistence

6. **Build Public Page**
   - Create property page template
   - Add reviews section
   - Style to match Flex Living

7. **Google Reviews Research**
   - Set up Google Cloud account (if needed)
   - Test Places API
   - Document findings

8. **Documentation**
   - Write README
   - Document API behaviors
   - Create setup instructions

---

## 13. Risk Mitigation

### Potential Issues
1. **Hostaway API Changes**: Mock data ensures development continues
2. **Database Costs**: Use free tier providers initially
3. **Google API Access**: Document alternative approaches
4. **Performance with Large Datasets**: Implement pagination early
5. **Multi-user Conflicts**: Use optimistic updates with conflict resolution

---

This implementation plan provides a solid foundation for building the Reviews Dashboard. The recommended tech stack balances modern best practices with practical deployment options, ensuring a maintainable and scalable solution.

