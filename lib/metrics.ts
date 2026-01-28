/**
 * Metrics Helper
 * 
 * Provides utilities for measuring and analyzing page performance metrics
 */

export interface MetricsResult {
  url: string;
  status: number;
  statusText: string;
  ttfb: number; // Time to First Byte in milliseconds
  totalTime: number; // Total fetch time in milliseconds
  htmlSize: number; // HTML size in bytes
  htmlSizeKB: string; // HTML size formatted in KB
  headers: Record<string, string>;
  htmlPreview: string; // First 300 characters of HTML
  timestamp: string;
  error?: string;
}

/**
 * Fetches a URL and returns performance metrics
 * 
 * @param url - The URL to fetch and measure (can be absolute or relative)
 */
export async function measurePageMetrics(url: string): Promise<MetricsResult> {
  const startTime = Date.now();
  let ttfbTime = 0;
  
  try {
    // Determine if this is a relative or absolute URL
    const isRelative = url.startsWith('/');
    const fetchUrl = isRelative 
      ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}${url}`
      : url;
    
    console.log(`[Metrics] Fetching: ${fetchUrl} (original: ${url})`);
    
    const response = await fetch(fetchUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Next.js Metrics Lab',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    // Approximate TTFB (time when headers are received)
    ttfbTime = Date.now() - startTime;

    const html = await response.text();
    const totalTime = Date.now() - startTime;
    
    const htmlSize = new Blob([html]).size;
    const htmlSizeKB = (htmlSize / 1024).toFixed(2);

    // Extract response headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Get first 300 characters of HTML
    const htmlPreview = html.substring(0, 300).replace(/\s+/g, ' ').trim();

    return {
      url,
      status: response.status,
      statusText: response.statusText,
      ttfb: ttfbTime,
      totalTime,
      htmlSize,
      htmlSizeKB,
      headers,
      htmlPreview,
      timestamp: new Date().toISOString(),
      error: response.status >= 400 ? `HTTP ${response.status}: ${response.statusText}` : undefined,
    };
  } catch (error) {
    const totalTime = Date.now() - startTime;
    
    return {
      url,
      status: 0,
      statusText: 'Fetch Failed',
      ttfb: ttfbTime || totalTime,
      totalTime,
      htmlSize: 0,
      htmlSizeKB: '0.00',
      headers: {},
      htmlPreview: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Formats a timestamp for display
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Gets current server time for render timestamps
 */
export function getServerTimestamp(): string {
  return formatTimestamp();
}
