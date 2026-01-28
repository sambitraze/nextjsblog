/**
 * ISR (Incremental Static Regeneration) - Time-Based Blog Post Page
 * 
 * Rendering Mode: ISR with Time-Based Revalidation
 * - Pre-rendered at build time (like SSG)
 * - Automatically regenerates after specified time interval
 * - First user after interval triggers regeneration in background
 * - Subsequent users get fresh content
 * 
 * Use Case: Content that changes periodically (news, blogs, product listings)
 */

import { notFound } from 'next/navigation';
import { getPost, getAllSlugs } from '@/lib/directus';
import { getServerTimestamp } from '@/lib/metrics';

// ISR Configuration: Revalidate every 60 seconds
// After 60 seconds, the next request will trigger a regeneration
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params at build time
 * These pages will be pre-rendered and then revalidated
 */
export async function generateStaticParams() {
  console.log('[ISR-Time] Generating static params at build time');
  const slugs = await getAllSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ISRTimeBlogPost({ params }: PageProps) {
  const { slug } = await params;
  const renderTime = getServerTimestamp();
  
  console.log(`[ISR-Time] Rendering blog post: ${slug}`);

  // Use Next.js revalidation with tags for cache management
  const post = await getPost(slug, {
    next: {
      revalidate: 60, // Revalidate every 60 seconds
      tags: ['blog', `blog-${slug}`],
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Mode Badge */}
      <div className="mb-6">
        <span className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          ISR (Time-Based Revalidation)
        </span>
      </div>

      {/* Article */}
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-black-600 text-sm mb-6 space-y-1">
          <p>Last updated in CMS: {new Date(post.date_updated).toLocaleString()}</p>
          <p className="font-semibold text-purple-600">
            ⏱️ Rendered at: {renderTime}
          </p>
          <p className="text-xs text-black-700">
            (This page regenerates automatically after 60 seconds)
          </p>
        </div>

        <div 
          className="mt-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Explanation */}
      <div className="mt-12 p-6 bg-black-50 rounded-lg border border-black-200">
        <h2 className="text-xl font-semibold mb-3">About ISR Time-Based Mode</h2>
        <ul className="space-y-2 text-sm text-black-700">
          <li>✓ <strong>Pre-rendered:</strong> HTML generated at build time</li>
          <li>✓ <strong>Auto-Update:</strong> Regenerates after 60 seconds</li>
          <li>✓ <strong>Fast TTFB:</strong> Serves cached version while regenerating</li>
          <li>✓ <strong>SEO Friendly:</strong> Full HTML content in page source</li>
          <li>✓ <strong>Scalable:</strong> Background regeneration doesn&apos;t block users</li>
          <li>⚠ <strong>Stale-While-Revalidate:</strong> Users may see old content briefly</li>
        </ul>
        
        <div className="mt-4 text-xs text-black-700 font-mono">
          <p>Implementation: export const revalidate = 60</p>
          <p>Strategy: Time-based automatic revalidation</p>
        </div>
      </div>

      {/* ISR Behavior Explanation */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="text-sm font-semibold mb-2">How ISR Time-Based Works:</h3>
        <ol className="text-xs text-black-700 space-y-1 list-decimal list-inside">
          <li><strong>0-60s:</strong> All users get the cached version (fast)</li>
          <li><strong>After 60s:</strong> First user still gets cached version</li>
          <li><strong>Background:</strong> Next.js regenerates the page with fresh data</li>
          <li><strong>Next request:</strong> Users get the newly regenerated page</li>
          <li><strong>Repeat:</strong> Process repeats every 60 seconds</li>
        </ol>
      </div>

      {/* Testing Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold mb-2">Testing ISR Time-Based:</h3>
        <ol className="text-xs text-black-700 space-y-1 list-decimal list-inside">
          <li>Note the current &quot;Rendered at&quot; timestamp</li>
          <li>Refresh immediately - timestamp stays the same (cached)</li>
          <li>Wait 61+ seconds</li>
          <li>Refresh once - may still see old timestamp</li>
          <li>Refresh again - should see new timestamp (regenerated)</li>
          <li>Update content in Directus and wait 61+ seconds to see changes</li>
        </ol>
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
      </div>
    </div>
  );
}
