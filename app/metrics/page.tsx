/**
 * Metrics Lab Page
 * 
 * A tool for testing and comparing rendering modes by:
 * - Measuring TTFB (Time to First Byte)
 * - Analyzing HTML size
 * - Inspecting response headers
 * - Previewing HTML content
 */

'use client';

import { useState } from 'react';

interface MetricsResult {
  url: string;
  status: number;
  statusText: string;
  ttfb: number;
  totalTime: number;
  htmlSize: number;
  htmlSizeKB: string;
  headers: Record<string, string>;
  htmlPreview: string;
  timestamp: string;
  error?: string;
}

export default function MetricsLabPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MetricsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch metrics');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const quickTests = [
    { label: 'SSR', path: '/blog/ssr/hello-world' },
    { label: 'SSG', path: '/blog/ssg/hello-world' },
    { label: 'ISR (Time)', path: '/blog/isr/hello-world' },
    { label: 'ISR (On-Demand)', path: '/blog/isr-ondemand/hello-world' },
    { label: 'CSR', path: '/blog/csr/hello-world' },
  ];

  const fillUrl = (path: string) => {
    const baseUrl = window.location.origin;
    setUrl(`${baseUrl}${path}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 Metrics Lab</h1>
        <p className="text-black-600">
          Test and compare rendering modes by measuring TTFB, HTML size, and response behavior
        </p>
      </div>

      {/* Test Form */}
      <div className="bg-white rounded-lg border border-black-200 p-6 mb-6">
        <form onSubmit={handleTest} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-semibold mb-2">
              Enter URL to Test:
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/blog/ssr/my-post"
              className="w-full px-4 py-2 border border-black-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-black-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Testing...' : 'Run Test'}
          </button>
        </form>

        {/* Quick Test Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold mb-3">Quick Tests:</p>
          <div className="flex flex-wrap gap-2">
            {quickTests.map((test) => (
              <button
                key={test.label}
                onClick={() => fillUrl(test.path)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
              >
                {test.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-700 mt-2">
            Note: Make sure the blog post with slug &quot;sample&quot; exists in Directus
          </p>
          
          {/* Compare All Modes Link */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-semibold mb-2">🆕 Compare All Modes for a Slug:</p>
            <a 
              href="/metrics/sample"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-semibold"
            >
              Compare All Modes for "sample"
            </a>
            <p className="text-xs text-gray-700 mt-2">
              Test SSR, SSG, ISR, and CSR simultaneously for any slug
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-700 font-semibold mb-1">Error</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-black-200 p-4">
              <div className="text-sm text-black-800 mb-1">HTTP Status</div>
              <div className="text-2xl font-bold">
                <span className={result.status === 200 ? 'text-green-600' : 'text-red-600'}>
                  {result.status}
                </span>
              </div>
              <div className="text-xs text-black-600">{result.statusText}</div>
            </div>

            <div className="bg-white rounded-lg border border-black-200 p-4">
              <div className="text-sm text-black-800 mb-1">TTFB</div>
              <div className="text-2xl font-bold text-blue-600">{result.ttfb}ms</div>
              <div className="text-xs text-black-700">Time to First Byte</div>
            </div>

            <div className="bg-white rounded-lg border border-black-200 p-4">
              <div className="text-sm text-black-800 mb-1">Total Time</div>
              <div className="text-2xl font-bold text-purple-600">{result.totalTime}ms</div>
              <div className="text-xs text-black-600">Complete fetch time</div>
            </div>

            <div className="bg-white rounded-lg border border-black-200 p-4">
              <div className="text-sm text-black-800 mb-1">HTML Size</div>
              <div className="text-2xl font-bold text-orange-600">{result.htmlSizeKB} KB</div>
              <div className="text-xs text-black-700">{result.htmlSize.toLocaleString()} bytes</div>
            </div>
          </div>

          {/* Response Headers */}
          <div className="bg-white rounded-lg border border-black-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Response Headers</h3>
            <div className="bg-black-50 rounded p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black-300">
                    <th className="text-left py-2 font-semibold text-black-900">Header</th>
                    <th className="text-left py-2 font-semibold text-black-900">Value</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {Object.entries(result.headers).map(([key, value]) => (
                    <tr key={key} className="border-b border-black-200">
                      <td className="py-2 text-black-700">{key}</td>
                      <td className="py-2 text-black-900 break-all">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Highlight Important Headers */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-black-900">Key Headers to Notice:</p>
              <ul className="text-xs text-black-700 space-y-1">
                <li>• <strong>cache-control:</strong> Indicates caching behavior</li>
                <li>• <strong>x-nextjs-cache:</strong> Shows Next.js cache status (HIT/MISS/STALE)</li>
                <li>• <strong>content-length:</strong> Response size</li>
                <li>• <strong>age:</strong> How long response has been cached</li>
              </ul>
            </div>
          </div>

          {/* HTML Preview */}
          <div className="bg-white rounded-lg border border-black-200 p-6">
            <h3 className="text-lg font-semibold mb-4">HTML Preview (First 300 chars)</h3>
            <div className="bg-black-50 rounded p-4 overflow-x-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap text-black-900">
                {result.htmlPreview}
                {result.htmlPreview.length >= 300 && '...'}
              </pre>
            </div>
            <p className="text-xs text-black-700 mt-2">
              💡 For CSR pages, you&apos;ll see loading state, not the actual content
            </p>
          </div>

          {/* Metadata */}
          <div className="bg-black-50 rounded-lg p-4 text-xs text-black-800">
            <p>Tested: {new Date(result.timestamp).toLocaleString()}</p>
            <p>URL: <span className="font-mono">{result.url}</span></p>
          </div>
        </div>
      )}

      {/* Comparison Guide */}
      <div className="mt-12 bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Expected Results Guide</h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1">SSR (Server-Side Rendering)</h3>
            <ul className="text-black-700 space-y-1 ml-4">
              <li>• TTFB: Higher (100-500ms+) - server fetches data on each request</li>
              <li>• HTML Size: Larger - full content in HTML</li>
              <li>• Cache Header: no-cache or no-store</li>
              <li>• HTML Preview: Shows actual blog content</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">SSG (Static Site Generation)</h3>
            <ul className="text-black-700 space-y-1 ml-4">
              <li>• TTFB: Fastest (10-50ms) - served from CDN</li>
              <li>• HTML Size: Larger - full content in HTML</li>
              <li>• Cache Header: public, immutable</li>
              <li>• HTML Preview: Shows actual blog content</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">ISR (Incremental Static Regeneration)</h3>
            <ul className="text-black-700 space-y-1 ml-4">
              <li>• TTFB: Fast (20-100ms) - served from cache, regenerates in background</li>
              <li>• HTML Size: Larger - full content in HTML</li>
              <li>• Cache Header: s-maxage=60, stale-while-revalidate</li>
              <li>• HTML Preview: Shows actual blog content</li>
              <li>• x-nextjs-cache: HIT (cached) or MISS (regenerated)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">CSR (Client-Side Rendering)</h3>
            <ul className="text-black-700 space-y-1 ml-4">
              <li>• TTFB: Fast (10-50ms) - but only for HTML shell</li>
              <li>• HTML Size: Smaller - no content, just JavaScript</li>
              <li>• Cache Header: varies</li>
              <li>• HTML Preview: Shows loading state or React markup, NOT blog content</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8">
        <a href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
