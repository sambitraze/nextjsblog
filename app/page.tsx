/**
 * Home Page - Next.js Rendering Modes Demo
 * 
 * This app demonstrates all five rendering modes:
 * - SSR (Server-Side Rendering)
 * - SSG (Static Site Generation)
 * - ISR (Incremental Static Regeneration) - Time-based
 * - ISR (Incremental Static Regeneration) - On-demand
 * - CSR (Client-Side Rendering)
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black-900 mb-4">
            Next.js Rendering Modes Lab
          </h1>
          <p className="text-xl text-black-600 max-w-3xl mx-auto">
            Explore and test all five Next.js rendering strategies with a Directus-backed blog.
            Compare SSR, SSG, ISR (time-based), ISR (on-demand), and CSR.
          </p>
        </header>

        {/* Rendering Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* SSR */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🔄</span>
              <h2 className="text-2xl font-bold text-black-900">SSR</h2>
            </div>
            <p className="text-sm text-black-600 mb-4">
              Server-Side Rendering - Fresh data on every request
            </p>
            <ul className="text-xs text-black-700 space-y-1 mb-4">
              <li>✓ Always fresh</li>
              <li>✓ SEO friendly</li>
              <li>⚠ Higher TTFB</li>
            </ul>
            <a
              href="/blog/ssr/hello-world"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm font-semibold w-full text-center"
            >
              View SSR Example
            </a>
          </div>

          {/* SSG */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🏗️</span>
              <h2 className="text-2xl font-bold text-black-900">SSG</h2>
            </div>
            <p className="text-sm text-black-600 mb-4">
              Static Site Generation - Pre-rendered at build time
            </p>
            <ul className="text-xs text-black-700 space-y-1 mb-4">
              <li>✓ Fastest TTFB</li>
              <li>✓ SEO friendly</li>
              <li>⚠ Requires rebuild</li>
            </ul>
            <a
              href="/blog/ssg/hello-world"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm font-semibold w-full text-center"
            >
              View SSG Example
            </a>
          </div>

          {/* ISR Time-Based */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">⏱️</span>
              <h2 className="text-2xl font-bold text-black-900">ISR (Time)</h2>
            </div>
            <p className="text-sm text-black-600 mb-4">
              Incremental Static Regeneration - Auto-update after 60s
            </p>
            <ul className="text-xs text-black-700 space-y-1 mb-4">
              <li>✓ Fast TTFB</li>
              <li>✓ Auto-refresh</li>
              <li>✓ SEO friendly</li>
            </ul>
            <a
              href="/blog/isr/hello-world"
              className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors text-sm font-semibold w-full text-center"
            >
              View ISR (Time) Example
            </a>
          </div>

          {/* ISR On-Demand */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🎯</span>
              <h2 className="text-2xl font-bold text-black-900">ISR (On-Demand)</h2>
            </div>
            <p className="text-sm text-black-600 mb-4">
              Incremental Static Regeneration - Webhook triggered
            </p>
            <ul className="text-xs text-black-700 space-y-1 mb-4">
              <li>✓ Fast TTFB</li>
              <li>✓ Controlled updates</li>
              <li>✓ Webhook ready</li>
            </ul>
            <a
              href="/blog/isr-ondemand/hello-world"
              className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors text-sm font-semibold w-full text-center"
            >
              View ISR (On-Demand)
            </a>
          </div>

          {/* CSR */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🌐</span>
              <h2 className="text-2xl font-bold text-black-900">CSR</h2>
            </div>
            <p className="text-sm text-black-600 mb-4">
              Client-Side Rendering - Data fetched in browser
            </p>
            <ul className="text-xs text-black-700 space-y-1 mb-4">
              <li>✓ Interactive</li>
              <li>✓ Always fresh</li>
              <li>⚠ SEO risk</li>
            </ul>
            <a
              href="/blog/csr/hello-world"
              className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm font-semibold w-full text-center"
            >
              View CSR Example
            </a>
          </div>

          {/* Metrics Lab */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">📊</span>
              <h2 className="text-2xl font-bold text-black-900">Metrics Lab</h2>
            </div>
            <p className="text-sm text-black-600 mb-4">
              Test and compare TTFB, HTML size, and response headers
            </p>
            <ul className="text-xs text-black-700 space-y-1 mb-4">
              <li>• Measure TTFB</li>
              <li>• Analyze headers</li>
              <li>• Compare modes</li>
            </ul>
            <a
              href="/metrics"
              className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors text-sm font-semibold w-full text-center"
            >
              Open Metrics Lab
            </a>
            <a
              href="/metrics/hello-world"
              className="inline-block mt-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-200 transition-colors text-xs font-semibold w-full text-center border border-indigo-300"
            >
              Compare All Modes
            </a>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">🚀 Quick Setup</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Configure Directus</h3>
              <p className="text-black-600 mb-2">
                Create a <code className="bg-black-100 px-2 py-1 rounded">.env.local</code> file:
              </p>
              <pre className="bg-black-800 text-white p-4 rounded overflow-x-auto text-xs">
{`DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your_optional_token
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Create Directus Collection</h3>
              <p className="text-black-600 mb-2">In Directus, create a collection named <code className="bg-black-100 px-2 py-1 rounded">blog_posts</code> with fields:</p>
              <ul className="text-black-600 ml-6 list-disc">
                <li><code>slug</code> (String, required, unique)</li>
                <li><code>title</code> (String, required)</li>
                <li><code>content</code> (Text/WYSIWYG, required)</li>
                <li><code>date_updated</code> (Datetime, auto-populated)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Add Sample Post</h3>
              <p className="text-black-600 mb-2">Create a blog post with slug: <code className="bg-black-100 px-2 py-1 rounded">sample</code></p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Test the App</h3>
              <p className="text-black-600">Click any rendering mode above to see it in action!</p>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">🔌 API Endpoints</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Revalidation API</h3>
              <p className="text-sm text-black-600 mb-2">
                Trigger on-demand revalidation for ISR pages:
              </p>
              <pre className="bg-black-800 text-white p-4 rounded overflow-x-auto text-xs">
{`curl -X POST /api/revalidate \\
  -H "Content-Type: application/json" \\
  -d '{"slug": "sample"}'`}
              </pre>
              <a
                href="/api/revalidate"
                className="inline-block mt-2 text-blue-500 hover:underline text-sm"
              >
                View API Documentation →
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Metrics API</h3>
              <p className="text-sm text-black-600 mb-2">
                Measure page performance programmatically:
              </p>
              <pre className="bg-black-800 text-white p-4 rounded overflow-x-auto text-xs">
{`curl -X POST /api/metrics \\
  -H "Content-Type: application/json" \\
  -d '{"url": "/blog/ssr/hello-world"}'`}
              </pre>
              <a
                href="/api/metrics"
                className="inline-block mt-2 text-blue-500 hover:underline text-sm"
              >
                View API Documentation →
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-black-600 text-sm">
          <p>
            Built with Next.js {/* App Router */} &amp; Directus |{" "}
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Next.js Docs
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
