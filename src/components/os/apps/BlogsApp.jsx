'use client';
import { useState, useEffect } from 'react';
import BlogCard from '../../BlogCard';
import LoadingSpinner from '../../LoadingSpinner';

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

  if (loading) return <div className="flex items-center justify-center h-60"><LoadingSpinner text="Loading blog posts..." /></div>;

  if (error) return (
    <div className="p-6 text-center">
      <p className="text-red-400 text-sm mb-3">Failed to load blog posts</p>
      <a href="https://xauravww.hashnode.dev" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-gold/20 text-gold px-3 py-1.5 rounded-lg text-[11px] font-medium hover:bg-gold/30 transition-colors">
        Visit Blog Directly
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
      </a>
    </div>
  );

  return (
    <div className="p-4 md:p-5">
      {posts.length === 0 ? (
        <div className="text-center py-10 text-white/30 text-sm">No blog posts found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {posts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
          <div className="text-center mt-4">
            <a href="https://xauravww.hashnode.dev" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gold/15 text-gold px-4 py-2 rounded-lg text-[11px] font-medium hover:bg-gold/25 transition-colors border border-gold/20">
              View All Posts
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsApp;
