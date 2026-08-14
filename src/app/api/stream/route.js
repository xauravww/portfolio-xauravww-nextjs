import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { NextResponse } from 'next/server';
import play from 'play-dl';

const execFileAsync = promisify(execFile);

/**
 * Resolve a direct playable audio URL for a YouTube video.
 *
 * 1. yt-dlp — actively maintained and keeps up with YouTube's signature
 *    changes (play-dl's JS deciphering broke against current YouTube).
 *    Works where yt-dlp is installed (local dev machine).
 * 2. play-dl — fallback for serverless environments (e.g. Vercel) where
 *    the yt-dlp binary is not available.
 */
async function resolveWithYtDlp(id) {
  const { stdout } = await execFileAsync(
    'yt-dlp',
    [
      '--no-playlist',
      '--js-runtimes', 'node',
      // prefer m4a (AAC) — plays everywhere (ExoPlayer + AVPlayer)
      '-f', 'bestaudio[ext=m4a]/bestaudio[ext=opus]/bestaudio',
      '-g',
      `https://www.youtube.com/watch?v=${id}`,
    ],
    { timeout: 45000, maxBuffer: 1024 * 1024 },
  );
  return stdout.trim() || null;
}

async function resolveWithPlayDl(id) {
  const streamInfo = await play.stream(`https://www.youtube.com/watch?v=${id}`);
  return streamInfo?.url || null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    let url = null;
    try {
      url = await resolveWithYtDlp(id);
    } catch (e) {
      console.warn('yt-dlp unavailable, falling back to play-dl:', e.message);
    }
    if (!url) {
      url = await resolveWithPlayDl(id);
    }

    if (!url) {
      return NextResponse.json({ error: 'Audio format not found' }, { status: 404 });
    }
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Stream Error:', error);
    return NextResponse.json({ error: 'Failed to fetch audio stream' }, { status: 500 });
  }
}
