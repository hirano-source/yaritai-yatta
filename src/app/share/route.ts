import { NextRequest, NextResponse } from 'next/server';

// Share Target APIからのPOSTを受け取る
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const url = formData.get('url') as string || '';
    const text = formData.get('text') as string || '';
    const title = formData.get('title') as string || '';

    // 共有されたデータからURLを抽出
    // text内にURLが含まれている場合もある（Instagramなど）
    const extractedUrl = extractUrl(url || text);

    // クエリパラメータとしてリダイレクト
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('shared', 'true');
    if (extractedUrl) {
      redirectUrl.searchParams.set('url', extractedUrl);
    }
    if (title) {
      redirectUrl.searchParams.set('title', title);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Share target error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// GET対応（直接アクセス用）
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url') || '';
  const text = searchParams.get('text') || '';
  const title = searchParams.get('title') || '';

  const extractedUrl = extractUrl(url || text);

  const redirectUrl = new URL('/', request.url);
  redirectUrl.searchParams.set('shared', 'true');
  if (extractedUrl) {
    redirectUrl.searchParams.set('url', extractedUrl);
  }
  if (title) {
    redirectUrl.searchParams.set('title', title);
  }

  return NextResponse.redirect(redirectUrl);
}

// テキストからURLを抽出
function extractUrl(text: string): string | null {
  if (!text) return null;

  // URLパターンにマッチ
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = text.match(urlPattern);

  if (matches && matches.length > 0) {
    return matches[0];
  }

  return text.startsWith('http') ? text : null;
}
