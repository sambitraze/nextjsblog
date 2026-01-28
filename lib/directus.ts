/**
 * Directus CMS Helper
 * 
 * Provides functions to fetch blog posts from Directus headless CMS.
 * Configure DIRECTUS_URL and optionally DIRECTUS_TOKEN in your environment.
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://api.microheal.in';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date_updated: string;
}

/**
 * Fetches all blog post slugs from Directus
 * Used for static generation (SSG, ISR)
 */
export async function getAllSlugs(): Promise<string[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (DIRECTUS_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_TOKEN}`;
    }

    const response = await fetch(
      `${DIRECTUS_URL}/items/blogs?fields=slug`,
      { 
        headers,
        // Use no-store to ensure fresh data during builds
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch slugs from Directus:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data?.map((post: { slug: string }) => post.slug) || [];
  } catch (error) {
    console.error('Error fetching slugs from Directus:', error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug from Directus
 * 
 * @param slug - The blog post slug
 * @param cacheOptions - Optional Next.js cache configuration
 */
export async function getPost(
  slug: string,
  cacheOptions?: RequestInit['cache'] | { next?: { revalidate?: number | false; tags?: string[] } }
): Promise<BlogPost | null> {
  const startTime = Date.now();
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (DIRECTUS_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_TOKEN}`;
    }

    const fetchOptions: RequestInit = {
      headers,
    };

    // Apply cache options
    if (cacheOptions) {
      if (typeof cacheOptions === 'string') {
        fetchOptions.cache = cacheOptions;
      } else if (typeof cacheOptions === 'object' && 'next' in cacheOptions) {
        fetchOptions.next = cacheOptions.next;
      }
    }

    const response = await fetch(
      `${DIRECTUS_URL}/items/blogs?filter[slug][_eq]=${slug}&fields=slug,title,content,date_created,date_updated`,
      fetchOptions
    );

    const fetchTime = Date.now() - startTime;
    console.log(`[Directus] Fetched post "${slug}" in ${fetchTime}ms`);

    if (!response.ok) {
      console.error(`Failed to fetch post "${slug}" from Directus:`, response.statusText);
      return null;
    }

    const data = await response.json();
    const post = data.data?.[0];

    if (!post) {
      console.log(`Post "${slug}" not found in Directus`);
      return null;
    }

    return post;
  } catch (error) {
    const fetchTime = Date.now() - startTime;
    console.error(`Error fetching post "${slug}" from Directus (${fetchTime}ms):`, error);
    return null;
  }
}

/**
 * Type guard to check if Directus is configured
 */
export function isDirectusConfigured(): boolean {
  return !!DIRECTUS_URL && DIRECTUS_URL !== '';
}
