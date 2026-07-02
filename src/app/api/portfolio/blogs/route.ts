import { NextResponse } from 'next/server';

const HASHNODE_RSS_URL = 'https://xauravww.hashnode.dev/rss.xml';

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
    || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
}

function extractEnclosureUrl(xml: string): string {
  const match = xml.match(/<enclosure[^>]+url="([^"]+)"/i);
  return match ? match[1] : '';
}

function extractCategories(xml: string): { name: string; slug: string }[] {
  const tags: { name: string; slug: string }[] = [];
  const regex = /<category><!\[CDATA\[(.*?)\]\]><\/category>|<category>(.*?)<\/category>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const name = (match[1] || match[2]).trim();
    tags.push({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
  }
  return tags;
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const words = text.split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function extractSlug(url: string): string {
  return url.split('/').pop() || '';
}

export async function GET() {
  try {
    const username = process.env.HASHNODE_USERNAME || 'xauravww';
    const rssUrl = `https://${username}.hashnode.dev/rss.xml`;

    const response = await fetch(rssUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`RSS feed error: ${response.status}`);
    }

    const xml = await response.text();

    const items = xml.split('<item>').slice(1);

    const posts = items.slice(0, 6).map((item) => {
      const url = extractTag(item, 'link');
      const content = extractTag(item, 'content:encoded');
      const tags = extractCategories(item);

      return {
        id: extractTag(item, 'guid') || url,
        title: extractTag(item, 'title'),
        brief: extractTag(item, 'description'),
        slug: extractSlug(url),
        url,
        coverImage: {
          url: extractEnclosureUrl(item),
        },
        publishedAt: extractTag(item, 'pubDate'),
        readTimeInMinutes: estimateReadTime(content || extractTag(item, 'description')),
        tags,
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching Hashnode posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
