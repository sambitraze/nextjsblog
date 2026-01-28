/**
 * CSR (Client-Side Rendering) Blog Post Page
 * 
 * Rendering Mode: Client-Side Rendering
 * - No server-side rendering
 * - Data fetched in browser after page load
 * - Content NOT in HTML source (SEO risk)
 * - Fast initial page load, slower content display
 * 
 * Use Case: Authenticated content, personalized dashboards, interactive apps
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date_updated: string;
}

export default function CSRBlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTime, setFetchTime] = useState<number>(0);
  const [renderTime] = useState<string>(new Date().toISOString().replace('T', ' ').substring(0, 19));

  useEffect(() => {
    if (!slug) return;

    console.log(`[CSR] Fetching blog post: ${slug} from client`);
    
    const fetchPost = async () => {
      const startTime = Date.now();
      
      try {
        setLoading(true);
        setError(null);

        const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
        
        if (!DIRECTUS_URL) {
          throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not configured');
        }
        
        const response = await fetch(
          `${DIRECTUS_URL}/items/blog_posts?filter[slug][_eq]=${slug}&fields=slug,title,content,date_updated`,
          {
            cache: 'no-store',
          }
        );

        const fetchDuration = Date.now() - startTime;
        setFetchTime(fetchDuration);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        const fetchedPost = data.data?.[0];

        if (!fetchedPost) {
          throw new Error('Post not found');
        }

        setPost(fetchedPost);
      } catch (err) {
        console.error('[CSR] Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            CSR (Client-Side Rendering)
          </span>
        </div>
        
        <div className="animate-pulse">
          <div className="h-8 bg-black-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-black-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-black-200 rounded"></div>
            <div className="h-4 bg-black-200 rounded"></div>
            <div className="h-4 bg-black-200 rounded w-5/6"></div>
          </div>
        </div>
        
        <p className="mt-8 text-black-700 text-sm">
          ⏳ Loading content from Directus... (This happens in the browser)
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            CSR (Client-Side Rendering)
          </span>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Post</h2>
          <p className="text-red-600">{error}</p>
          
          <div className="mt-4 text-sm text-black-600">
            <p>Make sure:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Directus is running and accessible</li>
              <li>NEXT_PUBLIC_DIRECTUS_URL is set correctly</li>
              <li>The blog post exists with slug: <code className="bg-red-100 px-1">{slug}</code></li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <a href="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            CSR (Client-Side Rendering)
          </span>
        </div>
        <p className="text-black-800">Post not found</p>
        <div className="mt-8">
          <a href="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Mode Badge */}
      <div className="mb-6">
        <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          CSR (Client-Side Rendering)
        </span>
      </div>

      {/* Article */}
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-black-600 text-sm mb-6 space-y-1">
          <p>Last updated in CMS: {new Date(post.date_updated).toLocaleString()}</p>
          <p className="font-semibold text-red-600">
            🌐 Rendered at: {renderTime} (Client)
          </p>
          <p className="text-xs text-black-700">
            (Fetched in browser in {fetchTime}ms - content NOT in page source)
          </p>
        </div>

        <div 
          className="mt-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Explanation */}
      <div className="mt-12 p-6 bg-black-50 rounded-lg border border-black-200">
        <h2 className="text-xl font-semibold mb-3">About CSR Mode</h2>
        <ul className="space-y-2 text-sm text-black-700">
          <li>✓ <strong>Client-Side:</strong> Data fetched in the browser via JavaScript</li>
          <li>✓ <strong>Fast Initial Load:</strong> HTML shell loads quickly</li>
          <li>✓ <strong>Always Fresh:</strong> Every visit fetches latest data</li>
          <li>✓ <strong>Interactive:</strong> Great for authenticated/personalized content</li>
          <li>⚠ <strong>SEO Risk:</strong> Content NOT in HTML source (bad for SEO)</li>
          <li>⚠ <strong>Loading State:</strong> Users see loading spinner</li>
          <li>⚠ <strong>Client Load:</strong> Requires JavaScript enabled</li>
        </ul>
        
        <div className="mt-4 text-xs text-black-700 font-mono">
          <p>Implementation: &apos;use client&apos; + useEffect + fetch</p>
          <p>Data Fetching: Client-side in browser</p>
        </div>
      </div>

      {/* SEO Warning */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-sm font-semibold mb-2 text-red-700">⚠️ SEO Warning:</h3>
        <p className="text-xs text-black-700">
          Content is NOT in the HTML source. Search engines may not index this content properly.
          View page source (Ctrl+U) to verify - you&apos;ll see loading state, not the article content.
        </p>
      </div>

      {/* Testing Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold mb-2">Testing CSR:</h3>
        <ol className="text-xs text-black-700 space-y-1 list-decimal list-inside">
          <li>View page source (Ctrl+U or Cmd+U) - content is NOT in HTML</li>
          <li>Disable JavaScript - page shows only loading state</li>
          <li>Check Network tab - fetch happens after page load</li>
          <li>Refresh - always fetches fresh data from Directus</li>
          <li>Note the fetch time in the timestamp</li>
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
