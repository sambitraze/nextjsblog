/**
 * Revalidation API Endpoint
 * 
 * Triggers on-demand revalidation for ISR pages.
 * Can be called manually or via Directus webhooks.
 * 
 * Usage:
 *   POST /api/revalidate
 *   Body: { "slug": "my-post-slug" }
 * 
 * Directus Webhook Configuration:
 *   URL: https://your-domain.com/api/revalidate
 *   Method: POST
 *   Trigger: After Update (blog_posts)
 *   Body: {"slug": "{{$trigger.payload.slug}}"}
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, secret } = body;

    // Optional: Verify a secret token for security
    // Uncomment and set REVALIDATION_SECRET in your .env
    // const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
    // if (REVALIDATION_SECRET && secret !== REVALIDATION_SECRET) {
    //   return NextResponse.json(
    //     { error: 'Invalid secret token' },
    //     { status: 401 }
    //   );
    // }

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing required field: slug' },
        { status: 400 }
      );
    }

    console.log(`[Revalidation] Triggered for slug: ${slug}`);

    // Revalidate specific paths for the given slug
    revalidatePath(`/blog/isr/${slug}`);
    revalidatePath(`/blog/isr-ondemand/${slug}`);

    // Revalidate by tags (cache tags used in ISR pages)
    // Note: In Next.js 15+, revalidateTag requires the cache type as second parameter
    // For now, we rely on revalidatePath which handles the cache invalidation

    console.log(`[Revalidation] Completed for slug: ${slug}`);

    return NextResponse.json({
      success: true,
      message: 'Revalidation triggered successfully',
      slug,
      revalidated: [
        `/blog/isr/${slug}`,
        `/blog/isr-ondemand/${slug}`,
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidation] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to revalidate',
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
    name: 'Next.js On-Demand Revalidation API',
    description: 'Triggers on-demand revalidation for ISR pages',
    usage: {
      method: 'POST',
      endpoint: '/api/revalidate',
      body: {
        slug: 'string (required) - The blog post slug to revalidate',
        secret: 'string (optional) - Secret token for authentication',
      },
      example: {
        slug: 'my-post-slug',
      },
    },
    directusWebhook: {
      url: 'https://your-domain.com/api/revalidate',
      method: 'POST',
      trigger: 'After Update (blog_posts collection)',
      body: '{"slug": "{{$trigger.payload.slug}}"}',
      note: 'Configure in Directus: Settings → Webhooks',
    },
    curl: 'curl -X POST https://your-domain.com/api/revalidate -H "Content-Type: application/json" -d \'{"slug": "my-post-slug"}\'',
    localTest: 'curl -X POST http://localhost:3000/api/revalidate -H "Content-Type: application/json" -d \'{"slug": "my-post-slug"}\'',
    security: {
      recommended: 'Set REVALIDATION_SECRET environment variable',
      implementation: 'Uncomment secret validation in route.ts',
    },
  });
}
