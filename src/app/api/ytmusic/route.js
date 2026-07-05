import { NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();
let initialized = false;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    if (!initialized) {
      await ytmusic.initialize();
      initialized = true;
    }
    const songs = await ytmusic.searchSongs(query);
    
    // We only need top 15 results
    return NextResponse.json(songs.slice(0, 15));
  } catch (error) {
    console.error('YTMusic Search Error:', error);
    return NextResponse.json({ error: 'Failed to search YT Music' }, { status: 500 });
  }
}
