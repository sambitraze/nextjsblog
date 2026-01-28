/**
 * SSR (Server-Side Rendering) Blog Post Page
 * 
 * Rendering Mode: Dynamic (SSR)
 * - Forces dynamic rendering on every request
 * - Fresh data on every page load
 * - Higher TTFB due to server-side data fetching
 * - Full SEO support (content in HTML source)
 * 
 * Use Case: Real-time data, personalized content, frequently changing data
 */

import { notFound } from 'next/navigation';
import { getPost } from '@/lib/directus';
import { getServerTimestamp } from '@/lib/metrics';

// Force dynamic rendering - this page will NEVER be statically generated
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SSRBlogPost({ params }: PageProps) {
  const { slug } = await params;
  const renderTime = getServerTimestamp();
  
  console.log(`[SSR] Rendering blog post: ${slug}`);

  // Fetch with no-store to ensure fresh data on every request
  const post = await getPost(slug, 'no-store');

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Mode Badge */}
      <div className="mb-6">
        <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          SSR (Server-Side Rendering)
        </span>
      </div>

      {/* Article */}
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-black-600 text-sm mb-6 space-y-1">
          <p>Last updated: {new Date(post.date_updated).toLocaleString()}</p>
          <p className="font-semibold text-blue-600">
            🔄 Rendered at: {renderTime}
          </p>
          <p className="text-xs text-black-700">
            (This timestamp changes on every request - refresh to see)
          </p>
        </div>

        <div 
          className="mt-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Explanation */}
      <div className="mt-12 p-6 bg-black-50 rounded-lg border border-black-200">
        <h2 className="text-xl font-semibold mb-3">About SSR Mode</h2>
        <ul className="space-y-2 text-sm text-black-700">
          <li>✓ <strong>Dynamic:</strong> Page is rendered on the server for every request</li>
          <li>✓ <strong>Fresh Data:</strong> Always fetches the latest content from Directus</li>
          <li>✓ <strong>SEO Friendly:</strong> Full HTML content in page source</li>
          <li>⚠ <strong>Higher TTFB:</strong> Server must fetch data before responding</li>
          <li>⚠ <strong>Server Load:</strong> Each request hits your CMS</li>
        </ul>
        
        <div className="mt-4 text-xs text-black-700 font-mono">
          <p>Implementation: export const dynamic = &apos;force-dynamic&apos;</p>
          <p>Cache: &apos;no-store&apos;</p>
        </div>
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
