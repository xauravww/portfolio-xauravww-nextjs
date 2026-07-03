import { NextRequest, NextResponse } from 'next/server';

// Same-origin proxy so the in-app Safari can iframe pages that would otherwise
// refuse framing via X-Frame-Options / CSP frame-ancestors (Hashnode, GitHub, …).
// HTML responses get a <base> tag injected so relative assets/links resolve, and
// any embedded framing/CSP <meta> tags are stripped.

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '0.0.0.0' || h.endsWith('.local')) return true;
  // Block private / loopback / link-local IPv4 ranges (SSRF guard).
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (h === '::1' || h.startsWith('fc') || h.startsWith('fd')) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get('url');
  if (!target) return new NextResponse('Missing url', { status: 400 });

  let parsed: URL;
  try { parsed = new URL(target); } catch { return new NextResponse('Bad url', { status: 400 }); }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
    return new NextResponse('Unsupported protocol', { status: 400 });
  if (isBlockedHost(parsed.hostname)) return new NextResponse('Blocked host', { status: 403 });

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      redirect: 'follow',
      next: { revalidate: 300 },
    });
  } catch {
    return new NextResponse('Fetch failed', { status: 502 });
  }

  const contentType = upstream.headers.get('content-type') || '';

  // Non-HTML (images, css, js, fonts) — stream through untouched.
  if (!contentType.includes('text/html')) {
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { 'content-type': contentType, 'cache-control': 'public, max-age=300' },
    });
  }

  let html = await upstream.text();

  // Strip framing/CSP <meta> so the page can be shown in an iframe.
  html = html.replace(/<meta[^>]+http-equiv=["']?(content-security-policy|x-frame-options)["']?[^>]*>/gi, '');

  // Strip <script> tags. Modern sites (GitHub, etc.) are SPAs whose JS hijacks
  // link clicks and navigates the frame straight to the real origin — which then
  // refuses framing. Without JS the page is static but browsable, and every
  // navigation flows back through this proxy via the rewritten <a> hrefs below.
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Proxied hrefs must be absolute to OUR origin — a <base> pointing at the real
  // site would otherwise resolve a root-relative "/api/proxy" against that site.
  const selfOrigin = req.nextUrl.origin;
  const toProxy = (raw: string): string | null => {
    try {
      const abs = new URL(raw, parsed.href);
      if (abs.protocol !== 'http:' && abs.protocol !== 'https:') return null;
      return `${selfOrigin}/api/proxy?url=${encodeURIComponent(abs.href)}`;
    } catch { return null; }
  };

  // Rewrite anchor hrefs to route through this proxy (keeps navigation in-frame).
  html = html.replace(/(<a\b[^>]*\bhref=)(["'])(.*?)\2/gi, (m, pre, q, href) => {
    if (/^\s*(#|javascript:|mailto:|tel:)/i.test(href)) return m;
    const p = toProxy(href);
    return p ? `${pre}${q}${p}${q}` : m;
  });

  // Inject a <base> so relative asset URLs (css/img/font) resolve against the
  // real origin. Proxied <a> hrefs are absolute ("/api/proxy…") so base ignores them.
  const baseTag = `<base href="${parsed.origin}/">`;
  if (/<head[^>]*>/i.test(html)) html = html.replace(/(<head[^>]*>)/i, `$1${baseTag}`);
  else html = baseTag + html;

  return new NextResponse(html, {
    status: upstream.status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Deliberately omit X-Frame-Options / CSP so our own iframe can render it.
      'cache-control': 'public, max-age=300',
    },
  });
}
