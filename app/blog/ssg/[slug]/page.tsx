/**
 * SSG (Static Site Generation) Blog Post Page
 * 
 * Rendering Mode: Static Generation
 * - Pre-rendered at build time
 * - Fastest possible response time
 * - Data is "frozen" at build time
 * - Requires redeploy to update content
 * 
 * Use Case: Content that rarely changes, documentation, marketing pages
 */

import { notFound } from 'next/navigation';
import { getPost, getAllSlugs } from '@/lib/directus';
import { getServerTimestamp } from '@/lib/metrics';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params at build time
 * This tells Next.js which pages to pre-render
 */
export async function generateStaticParams() {
  console.log('[SSG] Generating static params at build time');
  const slugs = await getAllSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function SSGBlogPost({ params }: PageProps) {
  const { slug } = await params;
  const renderTime = getServerTimestamp();
  
  console.log(`[SSG] Rendering static blog post: ${slug} at build time`);

  // Fetch with force-cache to use cached data at build time
  const post = await getPost(slug, 'force-cache');

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Mode Badge */}
      <div className="mb-6">
        <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          SSG (Static Site Generation)
        </span>
      </div>

      {/* Article */}
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-black-600 text-sm mb-6 space-y-1">
          <p>Last updated in CMS: {new Date(post.date_updated).toLocaleString()}</p>
          <p className="font-semibold text-green-600">
            🏗️ Built at: {renderTime}
          </p>
          <p className="text-xs text-black-700">
            (This timestamp is frozen at build time - will NOT change on refresh)
          </p>
        </div>

        <div 
          className="mt-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Explanation */}
      <div className="mt-12 p-6 bg-black-50 rounded-lg border border-black-200">
        <h2 className="text-xl font-semibold mb-3">About SSG Mode</h2>
        <ul className="space-y-2 text-sm text-black-700">
          <li>✓ <strong>Pre-rendered:</strong> HTML generated at build time</li>
          <li>✓ <strong>Fastest TTFB:</strong> Static files served from CDN</li>
          <li>✓ <strong>SEO Friendly:</strong> Full HTML content in page source</li>
          <li>✓ <strong>Scalable:</strong> No server processing on each request</li>
          <li>⚠ <strong>Stale Data:</strong> Content frozen until next build</li>
          <li>⚠ <strong>Build Time:</strong> Requires redeploy to update</li>
        </ul>
        
        <div className="mt-4 text-xs text-black-700 font-mono">
          <p>Implementation: generateStaticParams()</p>
          <p>Cache: &apos;force-cache&apos;</p>
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold mb-2">Testing SSG:</h3>
        <ol className="text-xs text-black-700 space-y-1 list-decimal list-inside">
          <li>View page source - content should be in HTML</li>
          <li>Note the &quot;Built at&quot; timestamp</li>
          <li>Refresh the page - timestamp should NOT change</li>
          <li>Update content in Directus</li>
          <li>Refresh page - content will NOT update (frozen at build time)</li>
          <li>Rebuild the app to see changes</li>
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
