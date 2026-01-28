/**
 * Metrics API Endpoint
 * 
 * Server-side endpoint for measuring page performance metrics.
 * Used by the Metrics Lab page to analyze TTFB, HTML size, and headers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { measurePageMetrics } from '@/lib/metrics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Missing required field: url' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`[Metrics] Testing URL: ${url}`);
    
    // For Vercel deployments, when testing same-domain URLs,
    // use relative paths to avoid external fetch limitations
    let testUrl = url;
    const requestHost = request.headers.get('host');
    
    try {
      const urlObj = new URL(url);
      const urlHost = urlObj.host;
      
      // If testing our own domain on Vercel, use internal fetch
      if (requestHost && urlHost === requestHost) {
        testUrl = urlObj.pathname + urlObj.search;
        console.log(`[Metrics] Same-domain detected, using relative path: ${testUrl}`);
      }
    } catch (e) {
      console.log(`[Metrics] URL parsing issue:`, e);
    }

    // Measure page metrics
    const metrics = await measurePageMetrics(testUrl);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[Metrics] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to measure metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for documentation
 */
export async function GET() {
  return NextResponse.json({
    name: 'Metrics API',
    description: 'Measures page performance metrics including TTFB, HTML size, and response headers',
    usage: {
      method: 'POST',
      endpoint: '/api/metrics',
      body: {
        url: 'string (required) - The URL to test',
      },
      example: {
        url: 'https://your-domain.com/blog/ssr/hello-world',
      },
    },
    response: {
      url: 'string - The tested URL',
      status: 'number - HTTP status code',
      statusText: 'string - HTTP status message',
      ttfb: 'number - Time to First Byte in milliseconds',
      totalTime: 'number - Total fetch time in milliseconds',
      htmlSize: 'number - HTML size in bytes',
      htmlSizeKB: 'string - HTML size in KB',
      headers: 'object - Response headers',
      htmlPreview: 'string - First 300 characters of HTML',
      timestamp: 'string - ISO timestamp',
    },
  });
}
