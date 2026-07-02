'use client';
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Blogs = ({ containerId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fetch blog posts
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/portfolio/blogs');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          throw new Error('Failed to fetch posts');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Animate blog content
    gsap.fromTo(".blog-content",
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".Blogs",
          start: "top 70%",
          once: true,
        }
      }
    );

    // Animate blog cards with delay to ensure elements exist
    setTimeout(() => {
      if (document.querySelector('.blog-card')) {
        gsap.fromTo(".blog-card",
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".blog-grid",
              start: "top 80%",
              once: true,
            }
          }
        );
      }
    }, 100);
  }, []);

  return (
    <div
      className="Blogs min-h-screen relative flex flex-col items-center py-16 md:py-24"
      id={containerId}
    >
      <div className="section-overlay" />

      {/* Header */}
      <header className="section-content text-center mb-12 md:mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-heading tracking-tight">Latest Blog Posts</h2>
        <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded-full" />
      </header>

      {/* Content */}
      <div className="blog-content section-content w-full max-w-7xl px-4">
        {loading ? (
          <LoadingSpinner text="Loading blog posts..." />
        ) : error ? (
           <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-xl">
             <div className="text-error text-lg mb-4">Failed to load blog posts</div>
             <p className="text-body mb-6">
               Unable to fetch posts from Hashnode. Please check your configuration.
             </p>
             <a
               href="https://xauravww.hashnode.dev"
               target="_blank"
               rel="noopener noreferrer"
               className="bg-gold text-inverse px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
             >
               Visit Blog Directly
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
         ) : posts.length === 0 ? (
            <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-xl">
              <div className="text-heading text-lg mb-4">No blog posts found</div>
             <a
               href="https://xauravww.hashnode.dev"
               target="_blank"
               rel="noopener noreferrer"
               className="bg-gold text-inverse px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
             >
               Visit Blog Directly
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post, index) => (
                <div key={post.id} className="blog-card">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

             {/* View All Link */}
             <div className="text-center">
               <a
                 href="https://xauravww.hashnode.dev"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="bg-gold !text-inverse px-8 py-3 rounded-lg font-medium hover:bg-gold/90 transition-all inline-flex items-center"
               >
                 View All Posts
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Blogs.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default Blogs;
