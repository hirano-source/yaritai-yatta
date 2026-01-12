import { NextRequest, NextResponse } from 'next/server';

// Share Target APIからのPOSTを受け取る
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const url = formData.get('url') as string || '';
    const text = formData.get('text') as string || '';
    const title = formData.get('title') as string || '';

    console.log('Share POST received:', { url, text, title });

    // 共有されたデータからURLを抽出
    const extractedUrl = extractUrl(url || text);

    console.log('Extracted URL:', extractedUrl);

    // クエリパラメータを構築
    const params = new URLSearchParams();
    params.set('shared', 'true');
    if (extractedUrl) {
      params.set('url', extractedUrl);
    }
    if (title) {
      params.set('title', title);
    }

    const redirectPath = `/?${params.toString()}`;

    // HTMLでクライアントサイドリダイレクト（POSTリダイレクトの問題を回避）
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="refresh" content="0;url=${redirectPath}">
          <script>window.location.href = "${redirectPath}";</script>
        </head>
        <body>リダイレクト中...</body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
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
