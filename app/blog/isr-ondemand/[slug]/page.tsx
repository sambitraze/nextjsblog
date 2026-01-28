/**
 * ISR (Incremental Static Regeneration) - On-Demand Blog Post Page
 * 
 * Rendering Mode: ISR with On-Demand Revalidation
 * - Pre-rendered at build time (like SSG)
 * - Only regenerates when explicitly triggered via API
 * - Full control over when content updates
 * - Ideal for webhook-based updates from CMS
 * 
 * Use Case: Content updated via CMS webhooks, manual cache invalidation
 */

import { notFound } from 'next/navigation';
import { getPost, getAllSlugs } from '@/lib/directus';
import { getServerTimestamp } from '@/lib/metrics';

// ISR Configuration: Disable automatic time-based revalidation
// Only revalidate when explicitly triggered via revalidatePath/revalidateTag
export const revalidate = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params at build time
 * These pages will be pre-rendered and only updated on-demand
 */
export async function generateStaticParams() {
  console.log('[ISR-OnDemand] Generating static params at build time');
  const slugs = await getAllSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ISROnDemandBlogPost({ params }: PageProps) {
  const { slug } = await params;
  const renderTime = getServerTimestamp();
  
  console.log(`[ISR-OnDemand] Rendering blog post: ${slug}`);

  // Use Next.js revalidation with tags for cache management
  const post = await getPost(slug, {
    next: {
      revalidate: false, // No automatic revalidation
      tags: ['blog', `blog-${slug}`], // Tags for on-demand revalidation
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Mode Badge */}
      <div className="mb-6">
        <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          ISR (On-Demand Revalidation)
        </span>
      </div>

      {/* Article */}
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-black-600 text-sm mb-6 space-y-1">
          <p>Last updated in CMS: {new Date(post.date_updated).toLocaleString()}</p>
          <p className="font-semibold text-orange-600">
            🎯 Rendered at: {renderTime}
          </p>
          <p className="text-xs text-black-700">
            (This page only updates when revalidation API is triggered)
          </p>
        </div>

        <div 
          className="mt-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Explanation */}
      <div className="mt-12 p-6 bg-black-50 rounded-lg border border-black-200">
        <h2 className="text-xl font-semibold mb-3">About ISR On-Demand Mode</h2>
        <ul className="space-y-2 text-sm text-black-700">
          <li>✓ <strong>Pre-rendered:</strong> HTML generated at build time</li>
          <li>✓ <strong>Controlled Updates:</strong> Only regenerates when triggered</li>
          <li>✓ <strong>Fast TTFB:</strong> Serves cached version until revalidated</li>
          <li>✓ <strong>SEO Friendly:</strong> Full HTML content in page source</li>
          <li>✓ <strong>Webhook Ready:</strong> Perfect for CMS webhook integration</li>
          <li>✓ <strong>No Stale Content:</strong> Updates immediately when needed</li>
        </ul>
        
        <div className="mt-4 text-xs text-black-700 font-mono">
          <p>Implementation: export const revalidate = false</p>
          <p>Strategy: On-demand via revalidatePath() or revalidateTag()</p>
        </div>
      </div>

      {/* On-Demand Revalidation Instructions */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <h3 className="text-sm font-semibold mb-2">How to Trigger Revalidation:</h3>
        
        <div className="text-xs text-black-700 space-y-3">
          <div>
            <p className="font-semibold mb-1">Method 1: Using the Revalidation API</p>
            <pre className="bg-black-800 text-white p-2 rounded overflow-x-auto">
{`curl -X POST https://your-domain.com/api/revalidate \\
  -H "Content-Type: application/json" \\
  -d '{"slug": "${slug}"}'`}
            </pre>
          </div>

          <div>
            <p className="font-semibold mb-1">Method 2: Directus Webhook</p>
            <p className="text-xs mb-1">Configure in Directus: Settings → Webhooks</p>
            <pre className="bg-black-800 text-white p-2 rounded overflow-x-auto">
{`URL: https://your-domain.com/api/revalidate
Method: POST
Trigger: After Update (blog_posts)
Body: {"slug": "{{$trigger.payload.slug}}"}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold mb-2">Testing ISR On-Demand:</h3>
        <ol className="text-xs text-black-700 space-y-1 list-decimal list-inside">
          <li>Note the current &quot;Rendered at&quot; timestamp</li>
          <li>Refresh multiple times - timestamp stays the same (cached)</li>
          <li>Update content in Directus</li>
          <li>Refresh again - content NOT updated (still cached)</li>
          <li>Trigger revalidation API with slug: <code className="bg-black-200 px-1">{slug}</code></li>
          <li>Refresh page - should see new timestamp and content</li>
        </ol>
      </div>

      {/* Quick Test Button */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-sm font-semibold mb-2">Quick Test (Browser):</h3>
        <p className="text-xs text-black-700 mb-2">
          Open your browser console and run:
        </p>
        <pre className="bg-black-800 text-white p-2 rounded overflow-x-auto text-xs">
{`fetch('/api/revalidate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ slug: '${slug}' })
}).then(r => r.json()).then(console.log)`}
        </pre>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <a 
          href="/"
          className="text-blue-500 hover:underline"
        >
          ← Back to Home
        </a>
        <a 
          href="/metrics"
          className="text-blue-500 hover:underline"
        >
          📊 Test in Metrics Lab
        </a>
        <a 
          href="/api/revalidate"
          className="text-orange-500 hover:underline"
        >
          🔄 Revalidation API Docs
        </a>
      </div>
    </div>
  );
}
