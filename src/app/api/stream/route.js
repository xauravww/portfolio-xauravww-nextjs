import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { NextResponse } from 'next/server';
import play from 'play-dl';

const execFileAsync = promisify(execFile);

/**
 * Resolve a direct playable audio URL for a YouTube video.
 *
 * Fallback chain (each step validates the URL actually serves audio before
 * redirecting, so the app never receives a dead URL):
 *
 * 1. yt-dlp — default client, IPv4-forced (IPv6-signed URLs commonly fail on
 *    mobile networks). Falls back to the `tv` and `web` clients, which often
 *    succeed where the default client is DRM/experiment-blocked.
 * 2. Piped public API — an independent YouTube frontend. Instances are flaky
 *    (502s are common) but serve as a genuine last-resort source.
 * 3. play-dl — legacy fallback for serverless environments (Vercel) where the
 *    yt-dlp binary is not available.
 */
const PIPED_INSTANCES = [
  'pipedapi.kavin.rocks',
  'pipedapi.leptons.xyz',
  'api.piped.yt',
];

const AUDIO_FORMAT = 'bestaudio[ext=m4a]/bestaudio[ext=opus]/bestaudio';

async function resolveWithYtDlp(id, client) {
  const args = [
    '--no-playlist',
    '--js-runtimes',
    'node',
    // IPv4-signed URLs are far more reliably playable from mobile networks
    // than IPv6-signed ones.
    '--force-ipv4',
  ];
  if (client) {
    args.push('--extractor-args', `youtube:player_client=${client}`);
  }
  args.push('-f', AUDIO_FORMAT, '-g', `https://www.youtube.com/watch?v=${id}`);
  const { stdout } = await execFileAsync('yt-dlp', args, {
    timeout: 45000,
    maxBuffer: 1024 * 1024,
  });
  return stdout.trim() || null;
}

async function resolveWithPiped(id, instance) {
  const res = await fetch(`https://${instance}/streams/${id}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  if (!Array.isArray(data.audioStreams)) {
    return null;
  }
  const audio = data.audioStreams
    .filter((s) => s && s.url)
    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
  if (audio.length === 0) {
    return null;
  }
  // Prefer AAC (m4a) — plays everywhere (ExoPlayer + AVPlayer).
  const m4a = audio.find((s) => (s.mimeType || '').includes('audio/mp4'));
  return (m4a || audio[0]).url;
}

async function resolveWithPlayDl(id) {
  const streamInfo = await play.stream(`https://www.youtube.com/watch?v=${id}`);
  return streamInfo?.url || null;
}

/**
 * Confirm the URL actually serves audio before we redirect to it.
 * A cheap ranged GET (first 1KB) — 200/206 means playable; 403/404 means
 * expired/blocked, so we can move to the next fallback instead.
 */
async function isUrlPlayable(url) {
  try {
    const res = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
      signal: AbortSignal.timeout(8000),
    });
    const ok = res.status === 200 || res.status === 206;
    // release the connection without downloading the rest of the file
    res.body?.getReader()?.cancel().catch(() => {});
    return ok;
  } catch {
    return false;
  }
}

async function resolveStreamUrl(id) {
  // yt-dlp: default client, then tv, then web
  for (const client of [null, 'tv', 'web']) {
    try {
      const url = await resolveWithYtDlp(id, client);
      if (url && (await isUrlPlayable(url))) {
        return url;
      }
    } catch (e) {
      console.warn(`yt-dlp client=${client} failed:`, e.message);
    }
  }

  // Piped public instances
  for (const instance of PIPED_INSTANCES) {
    try {
      const url = await resolveWithPiped(id, instance);
      if (url && (await isUrlPlayable(url))) {
        return url;
      }
    } catch (e) {
      console.warn(`Piped ${instance} failed:`, e.message);
    }
  }

  // Legacy serverless fallback
  try {
    const url = await resolveWithPlayDl(id);
    if (url && (await isUrlPlayable(url))) {
      return url;
    }
  } catch (e) {
    console.warn('play-dl fallback failed:', e.message);
  }

  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const url = await resolveStreamUrl(id);
    if (!url) {
      return NextResponse.json(
        { error: 'Audio stream unavailable' },
        { status: 404 },
      );
    }
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Stream Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio stream' },
      { status: 500 },
    );
  }
}
