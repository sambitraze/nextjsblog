/**
 * Single Slug Metrics Comparison Page
 * 
 * Compare all rendering modes (SSR, SSG, ISR, CSR) for a single blog post slug
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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
}

interface ModeResult {
  mode: string;
  label: string;
  color: string;
  result: MetricsResult | null;
  error: string | null;
  loading: boolean;
}

export default function SlugMetricsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [baseUrl, setBaseUrl] = useState('');
  const [testing, setTesting] = useState(false);
  
  const [modes, setModes] = useState<ModeResult[]>([
    { mode: 'ssr', label: 'SSR', color: 'blue', result: null, error: null, loading: false },
    { mode: 'ssg', label: 'SSG', color: 'green', result: null, error: null, loading: false },
    { mode: 'isr', label: 'ISR (Time)', color: 'purple', result: null, error: null, loading: false },
    { mode: 'isr-ondemand', label: 'ISR (On-Demand)', color: 'orange', result: null, error: null, loading: false },
    { mode: 'csr', label: 'CSR', color: 'red', result: null, error: null, loading: false },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const testSingleMode = async (mode: string) => {
    const url = `${baseUrl}/blog/${mode}/${slug}`;
    
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

      return { result: data, error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  const testAllModes = async () => {
    setTesting(true);
    
    // Set all to loading
    setModes(prev => prev.map(m => ({ ...m, loading: true, result: null, error: null })));

    // Test each mode sequentially
    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      const { result, error } = await testSingleMode(mode.mode);
      
      setModes(prev => prev.map((m, idx) => 
        idx === i ? { ...m, result, error, loading: false } : m
      ));
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTesting(false);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-500 bg-blue-50',
      green: 'border-green-500 bg-green-50',
      purple: 'border-purple-500 bg-purple-50',
      orange: 'border-orange-500 bg-orange-50',
      red: 'border-red-500 bg-red-50',
    };
    return colors[color] || 'border-gray-500 bg-gray-50';
  };

  const getMetricColor = (value: number, metric: 'ttfb' | 'size') => {
    if (metric === 'ttfb') {
      if (value < 50) return 'text-green-600';
      if (value < 200) return 'text-blue-600';
      return 'text-orange-600';
    } else {
      if (value < 10) return 'text-green-600';
      if (value < 30) return 'text-blue-600';
      return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          📊 Compare: <span className="text-blue-600">{slug}</span>
        </h1>
        <p className="text-gray-700">
          Test all 5 rendering modes for this slug and compare their performance
        </p>
      </div>

      {/* Test Button */}
      <div className="mb-8">
        <button
          onClick={testAllModes}
          disabled={testing || !baseUrl}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {testing ? 'Testing All Modes...' : 'Test All Modes'}
        </button>
        {!baseUrl && (
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {modes.map((mode) => (
          <div
            key={mode.mode}
            className={`rounded-lg border-l-4 p-6 ${getColorClasses(mode.color)}`}
          >
            <h3 className="text-xl font-bold mb-4">{mode.label}</h3>

            {mode.loading && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            )}

            {mode.error && (
              <div className="text-red-600 text-sm">
                <p className="font-semibold">Error:</p>
                <p>{mode.error}</p>
              </div>
            )}

            {mode.result && (
              <div className="space-y-3">
                {/* Status */}
                <div>
                  <div className="text-xs text-gray-700 mb-1">Status</div>
                  <div className={`text-lg font-bold ${mode.result.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                    {mode.result.status}
                  </div>
                </div>

                {/* TTFB */}
                <div>
                  <div className="text-xs text-gray-700 mb-1">TTFB</div>
                  <div className={`text-2xl font-bold ${getMetricColor(mode.result.ttfb, 'ttfb')}`}>
                    {mode.result.ttfb}ms
                  </div>
                </div>

                {/* Total Time */}
                <div>
                  <div className="text-xs text-gray-700 mb-1">Total Time</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {mode.result.totalTime}ms
                  </div>
                </div>

                {/* HTML Size */}
                <div>
                  <div className="text-xs text-gray-700 mb-1">HTML Size</div>
                  <div className={`text-lg font-semibold ${getMetricColor(parseFloat(mode.result.htmlSizeKB), 'size')}`}>
                    {mode.result.htmlSizeKB} KB
                  </div>
                </div>

                {/* Cache Header */}
                <div>
                  <div className="text-xs text-gray-700 mb-1">Cache Control</div>
                  <div className="text-xs font-mono text-gray-800 break-all">
                    {mode.result.headers['cache-control'] || 'Not set'}
                  </div>
                </div>

                {/* Next.js Cache Status */}
                {mode.result.headers['x-nextjs-cache'] && (
                  <div>
                    <div className="text-xs text-gray-700 mb-1">Next.js Cache</div>
                    <div className="text-xs font-mono text-gray-800">
                      {mode.result.headers['x-nextjs-cache']}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      {modes.every(m => m.result) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Performance Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-2 font-semibold">Mode</th>
                  <th className="text-left py-3 px-2 font-semibold">TTFB</th>
                  <th className="text-left py-3 px-2 font-semibold">Total Time</th>
                  <th className="text-left py-3 px-2 font-semibold">HTML Size</th>
                  <th className="text-left py-3 px-2 font-semibold">Winner</th>
                </tr>
              </thead>
              <tbody>
                {modes.map((mode) => {
                  if (!mode.result) return null;
                  const isFastestTTFB = Math.min(...modes.filter(m => m.result).map(m => m.result!.ttfb)) === mode.result.ttfb;
                  const isSmallest = Math.min(...modes.filter(m => m.result).map(m => parseFloat(m.result!.htmlSizeKB))) === parseFloat(mode.result.htmlSizeKB);
                  
                  return (
                    <tr key={mode.mode} className="border-b border-gray-200">
                      <td className="py-3 px-2 font-semibold">{mode.label}</td>
                      <td className={`py-3 px-2 ${isFastestTTFB ? 'font-bold text-green-600' : ''}`}>
                        {mode.result.ttfb}ms {isFastestTTFB && '🏆'}
                      </td>
                      <td className="py-3 px-2">{mode.result.totalTime}ms</td>
                      <td className={`py-3 px-2 ${isSmallest ? 'font-bold text-green-600' : ''}`}>
                        {mode.result.htmlSizeKB} KB {isSmallest && '🏆'}
                      </td>
                      <td className="py-3 px-2">
                        {(isFastestTTFB || isSmallest) ? '✓' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      {modes.every(m => m.result) && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">💡 Insights</h2>
          <div className="space-y-2 text-sm text-gray-800">
            {(() => {
              const ttfbs = modes.filter(m => m.result).map(m => ({ mode: m.label, ttfb: m.result!.ttfb }));
              const fastest = ttfbs.reduce((a, b) => a.ttfb < b.ttfb ? a : b);
              const slowest = ttfbs.reduce((a, b) => a.ttfb > b.ttfb ? a : b);
              
              return (
                <>
                  <p>• <strong>Fastest TTFB:</strong> {fastest.mode} at {fastest.ttfb}ms</p>
                  <p>• <strong>Slowest TTFB:</strong> {slowest.mode} at {slowest.ttfb}ms</p>
                  <p>• <strong>Speed Difference:</strong> {(slowest.ttfb - fastest.ttfb).toFixed(0)}ms ({((slowest.ttfb / fastest.ttfb - 1) * 100).toFixed(0)}% slower)</p>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <a href="/metrics" className="text-blue-500 hover:underline">
          ← Back to Metrics Lab
        </a>
        <a href="/" className="text-blue-500 hover:underline">
          Home
        </a>
      </div>
    </div>
  );
}
