'use client';
import Image from 'next/image';
import { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fill = false, 
  width, 
  height, 
  priority = false,
  sizes,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (error) => {
    console.error('Image failed to load:', src, error);
    console.error('Error details:', error?.target?.src, error?.target?.currentSrc);
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-slate-800/50 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-400 text-xs">Image not found</p>
        </div>
      </div>
    );
  }

  // Handle SVG files differently - use regular img tag for SVGs
  const isSvg = src && src.toLowerCase().endsWith('.svg');

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {isSvg ? (
        <img
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${fill ? 'w-full h-full object-contain' : ''}`}
          style={fill ? { width: '100%', height: '100%' } : undefined}
          {...props}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${fill ? 'object-cover' : ''}`}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;