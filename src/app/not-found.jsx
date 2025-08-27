'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const NotFound = () => {
  useEffect(() => {
    // GSAP animation timeline for the Not Found page
    const tl = gsap.timeline();

    // Animate elements into view
    tl.fromTo(".notfound-container", 
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
    .fromTo(".notfound-code",
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
    )
    .fromTo(".notfound-title",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(".notfound-description",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    )
    .fromTo(".notfound-button",
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.3"
    );

    // Clean up animations on unmount
    return () => {
      gsap.killTweensOf(".notfound-container, .notfound-code, .notfound-title, .notfound-description, .notfound-button");
    };
  }, []);

  return (
    <div
      className="notfound-container min-h-screen flex flex-col justify-center items-center relative z-1 py-16 md:py-24 overflow-hidden"
    >
      {/* Background elements from the Home theme */}
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>
      <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-norepeat- bg-cover"></div>

      <div className="content-block flex flex-col items-center justify-center text-center z-[3] px-4">
        <h1 className="notfound-code font-['Cyborg'] text-8xl md:text-9xl lg:text-[12rem] font-bold text-[var(--text-light)] mb-2 tracking-tight">
          404
        </h1>
        <h2 className="notfound-title text-2xl md:text-3xl lg:text-4xl font-medium text-[var(--text-medium)] mb-4">
          Page Not Found
        </h2>
        <p className="notfound-description text-lg md:text-xl text-[var(--text-medium)] max-w-md md:max-w-lg mb-8">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>

        <Link
          href="/"
          className="notfound-button inline-block bg-[#f3d800] text-black font-semibold py-3 px-8 rounded-md text-lg md:text-xl hover:bg-[#f3d800]/90 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;