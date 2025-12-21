'use client';
import PropTypes from 'prop-types';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCardClick = () => {
    window.open(post.url, '_blank');
  };

  return (
    <div 
      className="group bg-[#1A1D24]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-xl p-4 md:p-6 cursor-pointer hover:bg-[#1A1D24]/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10"
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      {post.coverImage?.url && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg md:text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
        {post.title}
      </h3>

      {/* Brief */}
      <p className="text-[var(--text-medium)] text-sm mb-4 line-clamp-3">
        {post.brief}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.slug}
              className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
            >
              {tag.name}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs md:text-sm text-[var(--text-light)] mb-3">
        <span>{formatDate(post.publishedAt)}</span>
        <span>{post.readTimeInMinutes} min read</span>
      </div>

      {/* Read More Indicator */}
      <div className="flex items-center text-cyan-400 text-sm font-medium">
        Read More
        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    brief: PropTypes.string,
    url: PropTypes.string.isRequired,
    coverImage: PropTypes.shape({
      url: PropTypes.string
    }),
    publishedAt: PropTypes.string.isRequired,
    readTimeInMinutes: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
    }))
  }).isRequired
};

export default BlogCard;