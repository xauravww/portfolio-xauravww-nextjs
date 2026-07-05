import ytdl from '@distube/ytdl-core';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(id);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    
    if (format && format.url) {
      // Redirect directly to the raw audio stream URL
      return NextResponse.redirect(format.url);
    } else {
      return NextResponse.json({ error: 'Audio format not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('YTDL Stream Error:', error);
    return NextResponse.json({ error: 'Failed to fetch audio stream' }, { status: 500 });
  }
}
