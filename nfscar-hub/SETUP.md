# NFSCAR Review Hub - Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Supabase account (create free at [supabase.com](https://supabase.com))
- Vercel account (optional, for deployment)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: `nfscar-hub` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project" (wait for it to finish, ~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `prisma/schema.sql` from the nfscar-hub directory
4. Paste it into the SQL Editor
5. Click "Run" to execute
6. You should see "Success" message

## Step 3: Get API Credentials

1. In Supabase, go to **Settings → API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Anon Key** (under "Project API keys")
   - **Service Role Key** (scroll down to "Service Role Key")

## Step 4: Configure Environment Variables

1. In the `nfscar-hub` directory, copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key...
   NEXT_PUBLIC_DOMAIN=nfcscar.com
   ```

   **Important**: 
   - Keep `.env.local` private (never commit to git)
   - Replace the placeholder URLs and keys with your actual values
   - `NEXT_PUBLIC_DOMAIN` is optional for local development

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

## Step 7: Test the App

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Create your first business
3. Add a location with a Google Maps URL
4. Create an NFC card
5. Copy the short code and test the redirect at:
   ```
   http://localhost:3000/api/r/ABC1
   ```

## Deployment to Vercel

### Option 1: Connect GitHub (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. In "Environment Variables", add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_DOMAIN` (your custom domain)
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_DOMAIN
```

## Custom Domain Setup

### For Short URLs

1. Purchase a domain (e.g., `nfcscar.com`)
2. In Vercel project settings, go to **Domains**
3. Add your custom domain
4. Update your domain's DNS records to point to Vercel (instructions provided)
5. Set `NEXT_PUBLIC_DOMAIN=nfcscar.com` in environment variables

### DNS Configuration (Example for common providers)

**Vercel provides specific instructions, but typically:**
- Add CNAME record pointing to Vercel's domain
- Or configure nameservers to use Vercel

Check your domain provider's documentation and Vercel's instructions.

## Troubleshooting

### "Connection refused" error
- Verify Supabase project is running
- Check that SUPABASE_URL and keys are correct
- Ensure `.env.local` file exists

### Redirects not working
- Verify the short code exists in database
- Check that the card is marked as "active"
- Ensure destination URL is valid and accessible

### Database connection errors
- Verify credentials are correct
- Check that SQL schema was executed successfully
- Go to Supabase SQL Editor and run:
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  ```
  You should see: `businesses`, `locations`, `nfc_cards`

### Build errors on Vercel
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Check build logs in Vercel dashboard

## Next Steps

### Customize Short URLs

To change the short code format, edit `src/lib/utils.ts`:

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

### Add Authentication

To restrict dashboard access:
1. Enable Auth in Supabase (Settings → Auth → Providers)
2. Install `@supabase/auth-helpers-nextjs`
3. Add authentication middleware to protected pages

### Analytics Dashboard

To expand the stats page:
1. Add charts using Recharts (already in dependencies)
2. Query time-series data for tap trends
3. Add filtering by date range

## Support

- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js docs: [nextjs.org](https://nextjs.org)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
