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
      <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-no-repeat bg-cover"></div>
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>

      {/* Header */}
      <header className="text-3xl md:text-5xl text-white font-bold relative z-[3] text-center px-4 mb-12">
        Latest Blog Posts
        <div className="underline-below-header absolute w-3/5 h-1 bg-[#f3d800] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
      </header>

      {/* Content */}
      <div className="blog-content z-[3] relative w-full max-w-7xl px-4 opacity-0">
        {loading ? (
          <LoadingSpinner text="Loading blog posts..." />
        ) : error ? (
           <div className="bg-[#1A1D24]/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-xl">
             <div className="text-red-400 text-lg mb-4">Failed to load blog posts</div>
             <p className="text-[var(--text-medium)] mb-6">
               Unable to fetch posts from Hashnode. Please check your configuration.
             </p>
             <a
               href="https://xauravww.hashnode.dev"
               target="_blank"
               rel="noopener noreferrer"
               className="bg-[#f3d800] text-[#1A1D24] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
             >
               Visit Blog Directly
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
         ) : posts.length === 0 ? (
            <div className="bg-[#1A1D24]/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-xl">
              <div className="text-[var(--text-light)] text-lg mb-4">No blog posts found</div>
             <a
               href="https://xauravww.hashnode.dev"
               target="_blank"
               rel="noopener noreferrer"
               className="bg-[#f3d800] text-[#1A1D24] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
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
                 className="bg-[#f3d800] !text-[#1A1D24] px-8 py-3 rounded-lg font-medium hover:bg-[#f3d800]/90 transition-all inline-flex items-center"
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
