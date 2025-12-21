import { NextResponse } from 'next/server';

const HASHNODE_API_URL = 'https://gql.hashnode.com/';

export async function GET() {
  try {
    const query = `
      query GetUserPosts($username: String!) {
        user(username: $username) {
          posts(page: 1, pageSize: 6) {
            nodes {
              id
              title
              brief
              slug
              url
              coverImage {
                url
              }
              publishedAt
              readTimeInMinutes
              tags {
                name
                slug
              }
            }
          }
        }
      }
    `;

    const variables = {
      username: process.env.HASHNODE_USERNAME || 'xauravww'
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header only if token is provided
    if (process.env.HASHNODE_TOKEN) {
      headers['Authorization'] = process.env.HASHNODE_TOKEN;
    }

    const response = await fetch(HASHNODE_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hashnode API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Hashnode GraphQL errors:', data.errors);
      throw new Error('GraphQL errors occurred');
    }

    const posts = data.data?.user?.posts?.nodes || [];

    // Return the latest 6 posts
    return NextResponse.json(posts.slice(0, 6));
  } catch (error) {
    console.error('Error fetching Hashnode posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}