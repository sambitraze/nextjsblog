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
}

/**
 * Fetches a URL and returns performance metrics
 * 
 * @param url - The URL to fetch and measure
 */
export async function measurePageMetrics(url: string): Promise<MetricsResult> {
  const startTime = Date.now();
  let ttfbTime = 0;
  
  try {
    const response = await fetch(url, {
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
    };
  } catch (error) {
    const totalTime = Date.now() - startTime;
    
    throw {
      url,
      status: 0,
      statusText: 'Fetch Failed',
      ttfb: ttfbTime || totalTime,
      totalTime,
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
