# NFSCAR Review Hub

A production-ready NFC review card management system with short URL redirects. Track business locations, manage NFC cards, and monitor customer engagement.

## Features

- **Business Management**: Create and manage multiple businesses
- **Location Tracking**: Add locations to businesses with Google Maps/Review URLs
- **NFC Card Management**: Create and manage NFC review cards with unique short codes
- **Smart Redirects**: Server-side 302 redirects enable URL changes without rewriting cards
- **Engagement Tracking**: Monitor tap counts and last tap timestamps
- **Mobile-First Design**: Responsive, premium interface optimized for mobile and desktop
- **Short URLs**: Generate short redirect URLs under 50 bytes (e.g., nfcscar.com/r/ABC1)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- Vercel account (optional, for deployment)

## Setup

### 1. Clone the repository

```bash
cd nfscar-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

- Create a new Supabase project at [supabase.com](https://supabase.com)
- Navigate to the SQL Editor in your Supabase dashboard
- Copy and paste the contents of `prisma/schema.sql` into a new query
- Execute the query to set up the database schema

### 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Get your credentials from Supabase:
- Go to Settings → API
- Copy your Project URL and Anon Key
- Copy your Service Role Key

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx
```

### 5. Run development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Database Schema

### Businesses
- `id` (UUID): Primary key
- `name` (text): Business name (unique)
- `description` (text): Optional description
- `created_at` / `updated_at`: Timestamps

### Locations
- `id` (UUID): Primary key
- `business_id` (UUID): Foreign key to businesses
- `name` (text): Location name
- `address` (text): Optional address
- `google_review_url` (text): Google Maps or review URL
- `created_at` / `updated_at`: Timestamps

### NFC Cards
- `id` (UUID): Primary key
- `location_id` (UUID): Foreign key to locations
- `short_code` (text): Unique 4-character code
- `destination_url` (text): Current redirect destination
- `is_active` (boolean): Card active status
- `tap_count` (integer): Number of taps
- `last_tap_at` (timestamp): Last tap timestamp
- `created_at` / `updated_at`: Timestamps

## API Routes

### Redirect
- `GET /api/r/[code]` - Redirect short URL to destination
  - Returns 302 redirect to destination URL
  - Increments tap count
  - Updates last_tap_at timestamp
  - Returns 404 if code not found
  - Returns 410 if card is inactive

## Dashboard Features

### Business Management
- View all businesses
- Create new businesses
- Select business to view locations

### Location Management
- View locations for selected business
- Create new locations with Google Maps/Review URL
- Select location to view NFC cards

### NFC Card Management
- Create new NFC cards
- View card short code (e.g., ABC1)
- Monitor tap count in real-time
- See last tap timestamp
- Edit destination URL without changing short code
- Toggle card active/inactive status
- Delete cards
- Copy short URL to clipboard

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Custom Domain

Add a custom domain in Vercel settings and update short URL generation to use your domain.

## Short URL Format

The app generates 4-character short codes by default:
- Characters: A-Z, a-z, 0-9 (62 possible values per character)
- Total combinations: 62^4 = ~14.7 million unique codes
- URL size: `nfcscar.com/r/ABC1` = ~22 bytes (well under 50-byte limit)

To modify short code length, edit `src/lib/utils.ts`:

```typescript
export function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {  // Change 4 to desired length
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

## Development

### Folder Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/          # API routes
│   ├── page.tsx      # Dashboard
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # Reusable components
├── lib/              # Utilities and clients
├── types/            # TypeScript types
```

### Component Library

- `Button` - Customizable button with variants
- `Card` - Content container with optional hover state
- `Input` - Form input with error states
- `Badge` - Status indicator with semantic colors
- `Modal` - Dialog component
- `Header` - Page header with title and actions

## Contributing

Build with:
- React 19 and Next.js 16 features
- Tailwind CSS for styling
- TypeScript for type safety
- Supabase SDK for database

## License

MIT
