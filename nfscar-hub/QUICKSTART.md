# NFSCAR Review Hub - Quick Start (5 minutes)

## TL;DR Setup

### 1. Clone & Install
```bash
cd nfscar-hub
npm install
```

### 2. Get Supabase Credentials
1. Create free project at [supabase.com](https://supabase.com)
2. Copy `Project URL` from Settings → API
3. Copy `Anon Key` from Settings → API
4. Copy `Service Role Key` from Settings → API

### 3. Setup Database
1. In Supabase dashboard → SQL Editor → New Query
2. Paste contents of `prisma/schema.sql`
3. Click "Run"

### 4. Configure App
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_key
NEXT_PUBLIC_DOMAIN=nfcscar.com
```

### 5. Run Dev Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) ✨

---

## First Steps in App

### Create Test Data
1. Click "New Business" → Enter name → Create
2. Click business card → Click "Add Location"
3. Enter location name & Google Maps URL → Create
4. Click location card → Click "Create Card"
5. Copy the short code (e.g., `ABC1`)

### Test Redirect
1. Visit: `http://localhost:3000/api/r/ABC1`
2. Should redirect to your Google Maps URL ✓

### Check Stats
1. Click "Stats" button
2. See tap count and engagement metrics

---

## Deploy to Vercel (2 minutes)

### Option 1: Automatic (Recommended)
1. Push to GitHub: `git push`
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project" → Select repo
4. Add environment variables (copy from `.env.local`)
5. Click "Deploy" ✓

### Option 2: CLI
```bash
npm i -g vercel
vercel --prod
# Follow prompts to add environment variables
```

---

## Useful Links

| Purpose | Link |
|---------|------|
| Full Setup | [SETUP.md](./SETUP.md) |
| Production | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Features | [FEATURES.md](./FEATURES.md) |
| Documentation | [README.md](./README.md) |
| Supabase Docs | [supabase.com/docs](https://supabase.com/docs) |
| Next.js Docs | [nextjs.org](https://nextjs.org) |

---

## Troubleshooting

### App won't start
```bash
# Check if all dependencies installed
npm install

# Check for errors
npm run build
```

### "Connection refused" error
- Verify Supabase credentials in `.env.local`
- Check credentials are correct (copy-paste from Supabase dashboard)
- Ensure `.env.local` file exists

### Redirects not working
- Verify database schema was applied (run SQL query)
- Check card exists: go to app dashboard
- Confirm card is marked "Active"
- Verify destination URL is valid

### Help!
1. Check [SETUP.md](./SETUP.md) troubleshooting section
2. Review [Supabase docs](https://supabase.com/docs)
3. Check [Next.js docs](https://nextjs.org/docs)

---

## Next: What's Included

✅ Beautiful dashboard UI
✅ Business & location management
✅ NFC card creation & tracking
✅ Tap count monitoring
✅ Editable redirect URLs
✅ Analytics & statistics
✅ Health check endpoint
✅ Mobile-responsive design
✅ Production-ready code
✅ Vercel deployment ready

---

## Project Structure
```
nfscar-hub/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Dashboard
│   │   ├── stats/            # Analytics page
│   │   ├── api/r/[code]      # Redirect endpoint
│   │   └── api/health/       # Health check
│   ├── components/           # UI components
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
├── prisma/
│   └── schema.sql            # Database schema
├── SETUP.md                  # Installation guide
├── DEPLOYMENT.md             # Production guide
└── FEATURES.md               # Feature list
```

---

## Key Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Check for errors
```

---

## Summary

You now have a production-ready NFC review management system with:
- Multi-business support
- Location tracking
- Smart URL redirects
- Engagement analytics
- Beautiful UI
- Vercel deployment

Ready to go live! 🚀
