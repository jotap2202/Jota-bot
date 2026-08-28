# NFSCAR Review Hub - Features & Capabilities

## Core Features

### Business Management
- **Create Businesses**: Add new businesses/brands
- **Edit Business Info**: Update business details
- **View Dashboard**: See overview of all businesses
- **Organization**: Hierarchical structure (Business → Location → Card)

### Location Management
- **Create Locations**: Add multiple locations per business
- **Location Details**: Store address and Google Maps/Review URL
- **Quick Access**: Click location to view associated NFC cards
- **Flexible URLs**: Support any review platform (Google Maps, Yelp, etc.)

### NFC Card Management
- **Create Cards**: Generate new NFC cards with unique short codes
- **Track Taps**: Monitor how many times each card has been scanned
- **Monitor Engagement**: See last tap timestamp for each card
- **Edit Destinations**: Change redirect URLs without rewriting cards
- **Status Control**: Activate/deactivate cards individually
- **Bulk Operations**: Delete unwanted cards

### Smart Redirects
- **Server-Side 302**: Permanent redirects without card rewrite
- **Unique Short Codes**: 4-character codes (62^4 = 14.7M combinations)
- **Fast Lookup**: Indexed database queries for performance
- **Change Destinations**: Update URLs on-the-fly
- **Custom Domains**: Use branded domains (e.g., nfcscar.com/r/ABC1)
- **Localhost Testing**: Works with localhost for development

### Dashboard Features
- **Card-Based UI**: Clean, scannable interface
- **Real-Time Metrics**: Shows tap counts and last tap time
- **Status Badges**: Active/Inactive indicators
- **Quick Copy**: One-click copy of short URLs
- **Direct Links**: Open destination URLs from dashboard
- **Responsive Design**: Mobile, tablet, desktop optimized
- **Light/Dark Mode**: System preference or manual toggle

### Analytics & Statistics
- **Overview Metrics**:
  - Total tap count across all cards
  - Active vs inactive card count
  - Business and location counts
  - Average taps per card

- **Card Rankings**: Top-performing cards sorted by engagement
- **Performance Data**: Tap count, last tap time, status per card
- **Business/Location Context**: See metrics per business and location
- **Engagement Tracking**: Historical tap data

### Technical Features

#### Performance
- **Optimized Redirects**: <100ms redirect response time
- **Database Indexing**: Fast lookups on short codes
- **Caching**: HTTP cache headers for frequently accessed redirects
- **Read Replicas**: Leverages Supabase read scaling

#### Reliability
- **Health Check**: `/api/health` endpoint for monitoring
- **Database Validation**: Connection testing on startup
- **Error Handling**: Graceful error pages for failed lookups
- **Auto-Updates**: Last tap timestamp auto-updating

#### Security
- **Row Level Security**: RLS policies in Supabase
- **Environment Variables**: All secrets protected
- **Service Role Key**: Only used server-side
- **HTTPS Only**: Automatic SSL on production
- **Input Validation**: Server-side validation of URLs

---

## Feature Comparison

### What This App Does
✅ Manage multiple businesses and locations
✅ Generate short NFC redirect URLs
✅ Track tap counts and engagement
✅ Edit destinations without rewriting cards
✅ Beautiful, mobile-friendly dashboard
✅ Analytics and statistics
✅ Deploy to production (Vercel + Supabase)
✅ Custom domain support
✅ Fast 302 redirects

### What This App Doesn't (Yet)
❌ SMS/Email notifications on taps
❌ User authentication & access control
❌ Advanced analytics (trends, charts, forecasts)
❌ Bulk NFC card generation/printing
❌ Integration with NFC hardware services
❌ Team collaboration & permissions
❌ API for third-party integrations
❌ Webhook notifications

### Potential Future Features
- [ ] User authentication (Supabase Auth)
- [ ] Admin access control & permissions
- [ ] Email notifications on tap activity
- [ ] SMS alerts for high-value locations
- [ ] Advanced charts (tap trends over time)
- [ ] CSV import/export of location data
- [ ] API endpoints for programmatic access
- [ ] Webhook support for custom integrations
- [ ] QR code generation (alternative to NFC)
- [ ] Social media integration
- [ ] Integration with review platforms (Google, Yelp)
- [ ] Automatic review monitoring

---

## Use Cases

### Use Case 1: Automotive Sales
**Scenario**: Car dealership with 5 locations wants customers to leave reviews

**Flow**:
1. Create business "ABC Auto Care"
2. Add 5 locations (Downtown, Midtown, Airport, Mall, Highway)
3. Add Google Review URL for each location
4. Create NFC card for each location
5. Print NFC tags with short codes
6. Place tags in waiting room or service areas
7. Customers tap card → redirected to Google Reviews
8. Track which locations get most engagement

**Benefits**:
- No need to reprint cards if reviews platform changes
- See which locations drive most reviews
- Quick feedback loop on customer satisfaction

### Use Case 2: Restaurant Chain
**Scenario**: Multi-location restaurant wants reviews on multiple platforms

**Flow**:
1. Create business "Joe's Pizza"
2. Add each location
3. Set Google Maps URL as initial destination
4. When switching to Yelp: edit destination, no card reprinting
5. Monitor tap counts per location
6. Dashboard shows which locations are getting love

**Benefits**:
- Flexibility to change platforms
- Easy A/B testing of review destinations
- Real-time engagement metrics

### Use Case 3: Service Business
**Scenario**: Plumbing company with vans and service calls

**Flow**:
1. Add business location
2. Create NFC card for van
3. Technician hands card to customer
4. Customer taps → Google Review
5. Track reviews generated per service
6. Identify top-performing technicians

**Benefits**:
- Portable review requests
- Trackable engagement
- Simple customer flow

---

## API Endpoints

### Public Endpoints
```
GET /api/r/[code]
- Redirects to destination URL
- Increments tap count
- Returns 302 redirect
- Returns 404 if not found
- Returns 410 if inactive
```

### Health Check
```
GET /api/health
- Returns service status
- Checks database connection
- Returns JSON response
```

---

## Data Schema

### businesses
```
id (UUID)
name (text, unique)
description (text, optional)
created_at (timestamp)
updated_at (timestamp)
```

### locations
```
id (UUID)
business_id (UUID) → businesses.id
name (text)
address (text, optional)
google_review_url (text)
created_at (timestamp)
updated_at (timestamp)
```

### nfc_cards
```
id (UUID)
location_id (UUID) → locations.id
short_code (text, unique)
destination_url (text)
is_active (boolean)
tap_count (integer, default 0)
last_tap_at (timestamp, optional)
created_at (timestamp)
updated_at (timestamp)
```

---

## Browser Support

### Desktop
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile
- iOS Safari (14+)
- Android Chrome (latest)
- Samsung Internet (latest)

### Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

---

## Accessibility Features

- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators on buttons/inputs
- ✅ Color contrast (WCAG AA)
- ✅ Mobile-friendly touch targets (44px minimum)
- ✅ Form validation feedback
- ✅ Alt text on icons

---

## Performance Metrics

### Target Performance
- Dashboard load: <1 second
- Redirect response: <100ms
- API health check: <200ms
- Stats page: <2 seconds

### Optimization Techniques
- Database indexing on `short_code`
- HTTP caching on redirect endpoint
- Next.js static generation where possible
- Efficient React component rendering
- Tailwind CSS utility classes (no unused CSS)

---

## Deployment Options

### Recommended: Vercel + Supabase
- Zero-config deployments
- Auto-scaling
- Global CDN
- Custom domain support
- Preview deployments for testing

### Alternative Options
- Self-hosted Next.js + PostgreSQL
- Railway + PostgreSQL
- Render + PostgreSQL

---

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY       # Supabase service role (server-side)
NEXT_PUBLIC_DOMAIN              # Custom domain (optional)
```

### Customization
- **Short Code Length**: Edit `generateShortCode()` in `src/lib/utils.ts`
- **Colors**: Update Tailwind config in `tailwind.config.ts`
- **Brand Name**: Change in app metadata and headers
- **Domain**: Set `NEXT_PUBLIC_DOMAIN` environment variable

---

## Support & Maintenance

### Monitoring
- Check `/api/health` regularly
- Monitor Vercel analytics
- Review Supabase query logs
- Track error rates

### Maintenance Tasks
- Update dependencies monthly
- Backup database regularly
- Review database size
- Archive old/inactive cards
- Monitor subscription limits

### Backups
- Vercel: automatic on each deployment
- Supabase: automatic daily (7-day free tier)
- Manual export: use SQL Editor in Supabase

---

## Getting Help

- **Docs**: README.md, SETUP.md, DEPLOYMENT.md
- **Supabase**: supabase.com/docs
- **Next.js**: nextjs.org/docs
- **Vercel**: vercel.com/docs
- **Issues**: GitHub repository

---

## Roadmap Ideas

Potential features for future versions:
- Authentication system for team access
- Detailed analytics & charts
- Bulk card management
- Email/SMS notifications
- Two-factor authentication
- API access for partners
- White-label options
- International domain support
- QR code alternative generation
