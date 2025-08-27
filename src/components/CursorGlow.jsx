'use client';
import React, { useState, useEffect } from 'react';

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Only add mousemove listener if not on mobile
    if (!isMobile) {
      const handleMouseMove = (event) => {
        setPosition({ x: event.clientX, y: event.clientY });
        if (!isVisible) setIsVisible(true);
      };

      // Add a small delay to avoid unnecessary renders
      let timeoutId;
      const throttledMouseMove = (event) => {
        if (!timeoutId) {
          timeoutId = setTimeout(() => {
            handleMouseMove(event);
            timeoutId = null;
          }, 10);
        }
      };

      window.addEventListener('mousemove', throttledMouseMove);
      
      // Hide cursor glow when mouse leaves window
      const handleMouseLeave = () => setIsVisible(false);
      const handleMouseEnter = () => setIsVisible(true);
      
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        window.removeEventListener('mousemove', throttledMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('resize', checkMobile);
        clearTimeout(timeoutId);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, isVisible]);

  // Don't render on mobile devices
  if (isMobile) return null;

  const glowStyle = {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    background: `radial-gradient(circle, rgba(74, 144, 226, 0.15) 0%, transparent 70%)`,
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 1,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease-out, top 0.2s ease-out, left 0.2s ease-out',
    willChange: 'top, left',
  };

  return <div style={glowStyle} />;
};

export default CursorGlow;