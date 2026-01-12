import { NextRequest, NextResponse } from 'next/server';

export interface OgpData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  url: string;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const ogpData = await fetchOgp(url);
    return NextResponse.json(ogpData);
  } catch (error) {
    console.error('OGP fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OGP data', url },
      { status: 500 }
    );
  }
}

async function fetchOgp(url: string): Promise<OgpData> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; YaritaiBot/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();

  return {
    title: extractMeta(html, 'og:title') || extractTitle(html),
    description: extractMeta(html, 'og:description') || extractMeta(html, 'description'),
    image: extractMeta(html, 'og:image'),
    siteName: extractMeta(html, 'og:site_name'),
    url: extractMeta(html, 'og:url') || url,
  };
}

function extractMeta(html: string, property: string): string | null {
  // og:xxx形式
  const ogMatch = html.match(
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')
  );
  if (ogMatch) return ogMatch[1];

  // content先の場合
  const ogMatch2 = html.match(
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, 'i')
  );
  if (ogMatch2) return ogMatch2[1];

  // name=xxx形式（description等）
  const nameMatch = html.match(
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')
  );
  if (nameMatch) return nameMatch[1];

  const nameMatch2 = html.match(
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${property}["']`, 'i')
  );
  if (nameMatch2) return nameMatch2[1];

  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}
