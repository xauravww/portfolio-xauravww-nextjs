import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*'))
      return cb(null, true);
    cb(new Error('CORS blocked'));
  }
}));

function isBlockedHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '0.0.0.0' || h.endsWith('.local')) return true;
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (h === '::1' || h.startsWith('fc') || h.startsWith('fd')) return true;
  return false;
}

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Reader mode — fetch, strip scripts/framing headers, return clean HTML
app.get('/reader', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: 'Missing url param' });

  let parsed;
  try { parsed = new URL(target); } catch { return res.status(400).json({ error: 'Bad url' }); }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
    return res.status(400).json({ error: 'Unsupported protocol' });
  if (isBlockedHost(parsed.hostname))
    return res.status(403).json({ error: 'Blocked host' });

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.set('content-type', contentType);
      res.set('cache-control', 'public, max-age=300');
      return res.send(buf);
    }

    let html = await upstream.text();

    // Strip framing/CSP meta tags
    html = html.replace(/<meta[^>]+http-equiv=["']?(content-security-policy|x-frame-options)["']?[^>]*>/gi, '');
    // Strip scripts — prevents SPA navigation escaping proxy
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '');

    // Inject base tag for relative asset resolution
    const baseTag = `<base href="${parsed.origin}/">`;
    if (/<head[^>]*>/i.test(html)) html = html.replace(/(<head[^>]*>)/i, `$1${baseTag}`);
    else html = baseTag + html;

    res.set('content-type', 'text/html; charset=utf-8');
    res.set('cache-control', 'public, max-age=300');
    res.send(html);
  } catch (e) {
    res.status(502).json({ error: 'Fetch failed', detail: e.message });
  }
});

// Web mode — full proxy for iframe embedding, rewrites links through proxy
app.get('/web', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: 'Missing url param' });

  let parsed;
  try { parsed = new URL(target); } catch { return res.status(400).json({ error: 'Bad url' }); }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
    return res.status(400).json({ error: 'Unsupported protocol' });
  if (isBlockedHost(parsed.hostname))
    return res.status(403).json({ error: 'Blocked host' });

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.set('content-type', contentType);
      res.set('cache-control', 'public, max-age=300');
      return res.send(buf);
    }

    let html = await upstream.text();

    // Strip framing blockers
    html = html.replace(/<meta[^>]+http-equiv=["']?(content-security-policy|x-frame-options)["']?[^>]*>/gi, '');

    // Build self-origin for link rewriting
    const selfOrigin = `${req.protocol}://${req.get('host')}`;
    const toProxy = (raw) => {
      try {
        const abs = new URL(raw, parsed.href);
        if (abs.protocol !== 'http:' && abs.protocol !== 'https:') return null;
        return `${selfOrigin}/web?url=${encodeURIComponent(abs.href)}`;
      } catch { return null; }
    };

    // Rewrite anchor hrefs through proxy
    html = html.replace(/(<a\b[^>]*\bhref=)(["'])(.*?)\2/gi, (m, pre, q, href) => {
      if (/^\s*(#|javascript:|mailto:|tel:)/i.test(href)) return m;
      const p = toProxy(href);
      return p ? `${pre}${q}${p}${q}` : m;
    });

    // Rewrite form actions through proxy
    html = html.replace(/(<form\b[^>]*\baction=)(["'])(.*?)\2/gi, (m, pre, q, action) => {
      const p = toProxy(action);
      return p ? `${pre}${q}${p}${q}` : m;
    });

    // Inject base for relative assets
    const baseTag = `<base href="${parsed.origin}/">`;
    if (/<head[^>]*>/i.test(html)) html = html.replace(/(<head[^>]*>)/i, `$1${baseTag}`);
    else html = baseTag + html;

    // Deliberately omit X-Frame-Options / CSP so iframe works
    res.set('content-type', 'text/html; charset=utf-8');
    res.set('cache-control', 'public, max-age=300');
    res.send(html);
  } catch (e) {
    res.status(502).json({ error: 'Fetch failed', detail: e.message });
  }
});

app.listen(PORT, () => console.log(`Proxy running on :${PORT}`));
