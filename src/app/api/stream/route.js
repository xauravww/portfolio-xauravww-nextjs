import play from 'play-dl';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const streamInfo = await play.stream(`https://www.youtube.com/watch?v=${id}`);
    
    if (streamInfo && streamInfo.url) {
      return NextResponse.redirect(streamInfo.url);
    } else {
      return NextResponse.json({ error: 'Audio format not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Play-DL Stream Error:', error);
    return NextResponse.json({ error: 'Failed to fetch audio stream' }, { status: 500 });
  }
}
