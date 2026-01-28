# Deployment Guide

## ✅ Pre-Deployment Checklist

Your app is now ready for deployment! Here's what was updated:

### Changes Made for Production:
- ✅ Removed hardcoded `localhost` references
- ✅ Updated metadata with proper title and description
- ✅ Environment variables properly configured
- ✅ Dark mode disabled (light theme only)
- ✅ All text colors optimized for readability

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Next.js Rendering Modes Lab"
git branch -M main
git remote add origin https://github.com/yourusername/nextjsblog.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `DIRECTUS_URL` - Your Directus instance URL (e.g., https://your-directus.com)
   - `DIRECTUS_TOKEN` - (Optional) Your Directus API token
   - `NEXT_PUBLIC_DIRECTUS_URL` - Same as DIRECTUS_URL (for client-side CSR)
   - `REVALIDATION_SECRET` - (Optional) Secret for securing revalidation API
5. Click "Deploy"

### Step 3: Configure Directus Webhook (Optional)
After deployment, set up automatic revalidation:

1. In Directus: Settings → Webhooks → Create New
2. Configure:
   - **Name**: Next.js ISR Revalidation
   - **Method**: POST
   - **URL**: `https://your-vercel-app.vercel.app/api/revalidate`
   - **Status**: Active
   - **Data**: After Update
   - **Collections**: blog_posts
   - **Request Body**:
     ```json
     {
       "slug": "{{$trigger.payload.slug}}"
     }
     ```

## 📋 Environment Variables Required

### For Vercel:
```env
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your_token_here
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
REVALIDATION_SECRET=your_secret_token
```

## 🧪 Test After Deployment

### 1. Test Each Rendering Mode:
- Visit `https://your-app.vercel.app/blog/ssr/hello-world`
- Visit `https://your-app.vercel.app/blog/ssg/hello-world`
- Visit `https://your-app.vercel.app/blog/isr/hello-world`
- Visit `https://your-app.vercel.app/blog/isr-ondemand/hello-world`
- Visit `https://your-app.vercel.app/blog/csr/hello-world`

### 2. Test Metrics Lab:
- Visit `https://your-app.vercel.app/metrics`
- Test each rendering mode

### 3. Test Revalidation API:
```bash
curl -X POST https://your-app.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"slug": "sample"}'
```

## 🔧 Build Command (Optional)
Vercel auto-detects Next.js, but if needed:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## ⚡ Performance Tips

1. **Enable Edge Runtime** (optional) for faster cold starts:
   Add to any page:
   ```typescript
   export const runtime = 'edge';
   ```

2. **Configure Caching**: Vercel automatically handles ISR caching

3. **Monitor Performance**: Use Vercel Analytics to track TTFB and other metrics

## 🐛 Troubleshooting

### Issue: Posts not loading
- **Solution**: Verify DIRECTUS_URL and NEXT_PUBLIC_DIRECTUS_URL are set correctly
- Check Directus collection is named exactly `blog_posts`
- Ensure Directus permissions allow public read access

### Issue: Revalidation not working
- **Solution**: Check webhook URL is correct (https, not http)
- Verify REVALIDATION_SECRET matches if enabled
- Check Vercel function logs

### Issue: Build fails
- **Solution**: Run `npm run build` locally first
- Check all TypeScript errors are resolved
- Verify all dependencies are in package.json

## 📚 Additional Resources

- [Vercel Deployment Docs](https://nextjs.org/docs/deployment)
- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Directus Webhooks Guide](https://docs.directus.io/configuration/webhooks.html)

---

Your app is production-ready! 🎉
