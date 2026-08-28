# NFSCAR Review Hub - Production Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] All sensitive credentials in environment variables (never hardcoded)
- [ ] `.env.local` and `.env*.local` in `.gitignore`
- [ ] Service Role Key only used server-side (API routes)
- [ ] RLS (Row Level Security) policies configured in Supabase
- [ ] No console.log statements with sensitive data
- [ ] CORS properly configured if needed

### Database
- [ ] SQL schema executed successfully in Supabase
- [ ] All tables created with correct relationships
- [ ] Indexes created for performance (already in schema.sql)
- [ ] Backup configured in Supabase (automatic daily)
- [ ] Database passwords stored securely

### Application
- [ ] All environment variables set
- [ ] `npm build` completes without errors
- [ ] No TypeScript errors: `npm run lint`
- [ ] All pages tested in development
- [ ] Mobile responsive design verified
- [ ] API endpoints tested (especially `/api/r/[code]`)

### Performance
- [ ] Redirect endpoint optimized (uses read replicas)
- [ ] Short code lookup uses indexed field
- [ ] Tap count update uses batch operations
- [ ] Cache headers configured in Next.js config

### Domain & DNS
- [ ] Custom domain purchased (if using)
- [ ] DNS records created for custom domain
- [ ] SSL certificate provisioned (automatic on Vercel)
- [ ] Domain aliases tested and working

---

## Deployment Steps

### Step 1: Prepare Repository

```bash
# Ensure everything is committed
git status

# Create production branch (optional)
git checkout -b production

# Push to GitHub
git push origin production
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
5. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_DOMAIN
   ```
6. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI (if not already)
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_DOMAIN

# Redeploy with environment variables
vercel --prod
```

### Step 3: Configure Custom Domain

#### In Vercel:
1. Go to project settings → Domains
2. Add custom domain (e.g., `nfcscar.com`)
3. Vercel provides DNS instructions

#### With Domain Provider:
- **Nameserver method**: Change nameservers to Vercel's (easiest)
- **CNAME method**: Point CNAME records to Vercel domain
- See your registrar's documentation

#### Verify DNS:
```bash
# Check DNS resolution
nslookup nfcscar.com

# Should resolve to: cname.vercel-dns.com
```

### Step 4: Update Environment Variables

After deployment, update Vercel environment:

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Update `NEXT_PUBLIC_DOMAIN=nfcscar.com` (your actual domain)
3. Redeploy:
   ```bash
   vercel --prod
   ```

### Step 5: Test Production

```bash
# Test redirect endpoint
curl -I https://nfcscar.com/r/ABC1

# Should return: 302 Found
# Location: https://your-google-maps-url
```

Test in browser:
1. Navigate to `https://nfcscar.com/r/ABC1`
2. Should redirect to destination URL
3. Tap count should increase in dashboard

---

## Post-Deployment

### Monitoring

**Vercel Analytics:**
- View in [vercel.com/dashboard](https://vercel.com/dashboard)
- Monitor response times, errors, traffic

**Supabase Monitoring:**
- Go to project → Database → Replication status
- Check query performance in SQL Editor

**Error Tracking:**
- Set up error logging (optional):
  ```typescript
  // Add to API routes
  if (error) {
    console.error("Error:", error);
    // Send to error tracking service (Sentry, etc.)
  }
  ```

### Backups

**Automatic (Vercel):**
- All deployments are immutable (can rollback)

**Database (Supabase):**
- Automatic daily backups (free tier: 7 days)
- Point-in-time recovery: enable in Settings

**Manual Backup:**
```bash
# Export from Supabase SQL Editor
-- Run in SQL Editor and save results
SELECT * FROM businesses;
SELECT * FROM locations;
SELECT * FROM nfc_cards;
```

### Maintenance

**Regular Tasks:**
- Monitor Supabase resource usage
- Review error logs weekly
- Clean up inactive cards (if desired)
- Update dependencies monthly

**Update Dependencies:**
```bash
npm update
npm audit fix
```

### Scaling

**Database:**
- Free tier: ~500K monthly active connections
- Paid tier: Higher limits with dedicated resources

**Short Codes:**
- Current: 4-char codes = ~14.7 million combinations
- For more codes: extend to 5 chars (~915 million)

**Traffic:**
- Vercel: auto-scales based on demand
- Supabase: scales within plan limits

---

## Rollback Plan

### Rollback Vercel Deployment:
1. In Vercel dashboard, go to Deployments
2. Click on previous working deployment
3. Click "Promote to Production"

### Rollback Database:
**Supabase backup restore:**
1. Go to Settings → Backups
2. Select backup before issue occurred
3. Click "Restore" (creates new project)
4. Update environment variables to new project

---

## Troubleshooting

### Deployment Fails
**Check build logs in Vercel:**
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. View "Build Log" tab
4. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

**Fix:**
```bash
# Test build locally
npm run build

# Check for errors
npm run lint
```

### Redirects Not Working
**Diagnose:**
```bash
# Test endpoint
curl -v https://nfcscar.com/api/r/ABC1

# Check response code
# 302 = working
# 404 = card not found
# 410 = card inactive
```

**Common issues:**
- Card doesn't exist in database
- Card marked as inactive
- Destination URL invalid
- Network connectivity issue

### Slow Performance
**Check:**
1. Vercel Analytics (response times)
2. Supabase query logs (slow queries)
3. Database size (may need indexing)

**Optimize:**
- Ensure indexes exist (in schema.sql)
- Review slow queries in Supabase
- Add caching if appropriate

### Database Connection Errors
**Check credentials:**
```bash
# Verify environment variables in Vercel
vercel env ls

# Should show all required variables
```

**Test connection:**
```bash
# Call health endpoint
curl https://nfcscar.com/api/health
```

---

## Security Best Practices

### Secrets Management
- Never commit `.env.local` to git
- Use Vercel environment variables (encrypted)
- Rotate Service Role Key annually
- Use different credentials per environment

### Database Security
- Enable RLS in Supabase ✓ (in schema)
- Use Row Level Security policies
- Audit sensitive operations
- Regular backups

### Application Security
- Keep dependencies updated (`npm audit`)
- Use HTTPS everywhere (automatic on Vercel)
- Validate input on server-side
- Implement rate limiting if needed

### DNS/Domain Security
- Use DNSSEC (if available)
- Monitor DNS changes
- Auto-renew SSL certificates (Vercel handles)

---

## Performance Tuning

### Database
```sql
-- Monitor slow queries in Supabase
-- Check indexes are being used
EXPLAIN ANALYZE 
SELECT * FROM nfc_cards WHERE short_code = 'ABC1';
```

### Caching
Update `next.config.ts` to adjust cache headers:
```typescript
headers: [
  {
    source: "/api/r/:code",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=60, s-maxage=300",
      },
    ],
  },
]
```

### API Optimization
- Add pagination for large result sets
- Use selective queries (only needed fields)
- Implement request batching

---

## Support & Resources

- **Vercel Support**: vercel.com/support
- **Supabase Docs**: supabase.com/docs
- **Next.js Docs**: nextjs.org/docs
- **GitHub Issues**: github.com/jotap2202/Jota-Agency/issues
