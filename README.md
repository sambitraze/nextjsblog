# Next.js Rendering Modes Lab

A comprehensive demonstration app showcasing all five Next.js rendering strategies using a Directus-backed blog. Test and compare SSR, SSG, ISR (time-based), ISR (on-demand), and CSR with built-in performance metrics.

## 🎯 Features

- **Five Rendering Modes**: Complete implementations of SSR, SSG, ISR (time & on-demand), and CSR
- **Directus Integration**: Headless CMS with real-time data fetching
- **Metrics Lab**: Visual performance comparison tool
- **On-Demand Revalidation**: Webhook-ready API for instant cache updates
- **Production Ready**: Deployable to Vercel without modification
- **Educational**: Clear comments and visual indicators for each mode

## 📁 Project Structure

```
app/
├── blog/
│   ├── ssr/[slug]/page.tsx         # Server-Side Rendering
│   ├── ssg/[slug]/page.tsx         # Static Site Generation
│   ├── isr/[slug]/page.tsx         # ISR (time-based, 60s)
│   ├── isr-ondemand/[slug]/page.tsx # ISR (on-demand revalidation)
│   └── csr/[slug]/page.tsx         # Client-Side Rendering
├── metrics/page.tsx                 # Performance metrics lab
├── api/
│   ├── revalidate/route.ts         # On-demand revalidation API
│   └── metrics/route.ts            # Performance testing API
├── layout.tsx
└── page.tsx                         # Home page with navigation

lib/
├── directus.ts                      # Directus CMS helper functions
└── metrics.ts                       # Performance measurement utilities
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Directus

Create a `.env.local` file:

```env
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your_optional_token
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
```

### 3. Setup Directus Collection

In your Directus instance, create a collection named `blog_posts` with these fields:

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| `slug` | String | Yes | Yes | URL-friendly identifier |
| `title` | String | Yes | No | Post title |
| `content` | Text/WYSIWYG | Yes | No | HTML content |
| `date_updated` | Datetime | No | No | Auto-populated |

**Permissions**: Make the collection publicly readable or configure authentication token.

### 4. Add Sample Data

Create a blog post in Directus with:
- **slug**: `sample`
- **title**: `Sample Blog Post`
- **content**: Any HTML content you want

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Rendering Modes Explained

### SSR (Server-Side Rendering)
**Route**: `/blog/ssr/[slug]`

- Renders on the server for **every request**
- Always fetches fresh data from Directus
- Full SEO support (content in HTML source)
- Higher TTFB due to server processing

**Use Cases**: Real-time data, personalized content, frequently changing data

---

### SSG (Static Site Generation)
**Route**: `/blog/ssg/[slug]`

- Pre-rendered at **build time**
- Fastest possible response (served from CDN)
- Data frozen until next deployment
- Requires rebuild to update content

**Use Cases**: Documentation, marketing pages, rarely changing content

---

### ISR (Time-Based Revalidation)
**Route**: `/blog/isr/[slug]`

- Pre-rendered at build time
- Automatically regenerates after **60 seconds**
- Serves cached version while regenerating (stale-while-revalidate)
- Fast TTFB with automatic updates

**Use Cases**: News sites, blogs, product listings with periodic updates

---

### ISR (On-Demand Revalidation)
**Route**: `/blog/isr-ondemand/[slug]`

- Pre-rendered at build time
- Only regenerates when **explicitly triggered** via API
- Perfect for webhook integration with CMS
- Full control over cache invalidation

**Trigger Revalidation**:
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"slug": "sample"}'
```

**Use Cases**: CMS webhooks, manual cache control, content approval workflows

---

### CSR (Client-Side Rendering)
**Route**: `/blog/csr/[slug]`

- Fetches data in the **browser** after page load
- No content in HTML source (SEO risk)
- Shows loading state while fetching
- Always fetches fresh data

**Use Cases**: Authenticated content, personalized dashboards, interactive apps

## 🧪 Testing Each Mode

Visit the home page for detailed testing instructions for each rendering mode, or use the **Metrics Lab** at `/metrics` to compare performance.

## 🔌 API Endpoints

### Revalidation API
`POST /api/revalidate` - Triggers on-demand revalidation for ISR pages

### Metrics API
`POST /api/metrics` - Measures page performance metrics

Visit the API endpoints directly for full documentation.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables (see `.env.example`)
4. Deploy

### Configure Directus Webhook

After deployment, update your Directus webhook URL to:
```
https://your-app.vercel.app/api/revalidate
```

## 📚 Learn More

- [Next.js Rendering Strategies](https://nextjs.org/docs/app/building-your-application/rendering)
- [Data Fetching and Caching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Directus Documentation](https://docs.directus.io/)

---

Built with ❤️ using Next.js 15 (App Router) and Directus
