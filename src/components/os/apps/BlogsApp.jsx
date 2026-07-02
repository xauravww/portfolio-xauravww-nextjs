'use client';
import { useState, useEffect } from 'react';
import { Page, Card, Tag, Button, Centered } from './ui';
import LoadingSpinner from '../../LoadingSpinner';

const ExternalIcon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>;
const CalendarIcon = <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockIcon = <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const BlogCardMac = ({ post }) => (
  <Card className="flex flex-col overflow-hidden cursor-default hover:ring-1 hover:ring-white/[0.12] transition-all">
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="contents">
      {post.coverImage?.url && (
        <div className="w-full aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage.url} alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={e => { e.target.style.display = 'none'; }} />
        </div>
      )}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <h3 className="text-[14px] font-semibold text-white leading-tight line-clamp-2">{post.title}</h3>
        {post.brief && <p className="text-[12px] text-white/50 leading-relaxed line-clamp-2">{post.brief}</p>}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map(t => <Tag key={t.slug}>{t.name}</Tag>)}
            {post.tags.length > 3 && <Tag>+{post.tags.length - 3}</Tag>}
          </div>
        )}

        <div className="flex items-center gap-3 mt-auto pt-1 text-[11px] text-white/35">
          <span className="flex items-center gap-1">{CalendarIcon}{formatDate(post.publishedAt)}</span>
          {post.readTimeInMinutes && <span className="flex items-center gap-1">{ClockIcon}{post.readTimeInMinutes} min</span>}
        </div>
      </div>
    </a>
  </Card>
);

const BlogsApp = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/blogs');
        if (res.ok) setPosts(await res.json());
        else throw new Error('Failed to fetch');
      } catch (e) { setError(e.message); console.error('Error fetching blogs:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Centered><LoadingSpinner text="Loading blog posts..." /></Centered>;

  if (error) return (
    <Centered>
      <div className="text-center space-y-3">
        <p className="text-[13px] text-red-400/80">Failed to load blog posts</p>
        <Button href="https://xauravww.hashnode.dev" variant="accent" icon={ExternalIcon}>Visit Blog</Button>
      </div>
    </Centered>
  );

  return (
    <Page>
      {posts.length === 0 ? (
        <Centered>No blog posts found.</Centered>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {posts.map(post => <BlogCardMac key={post.id} post={post} />)}
          </div>
          <div className="text-center mt-4">
            <Button href="https://xauravww.hashnode.dev" variant="default" icon={ExternalIcon}>View All Posts</Button>
          </div>
        </>
      )}
    </Page>
  );
};

export default BlogsApp;
