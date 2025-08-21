'use client';
import PropTypes from "prop-types";
import Pagination from "../components/Pagination";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Blogs = ({ containerId }) => {

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".blog-content",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".Blogs",
          start: "top 70%",
        }
      }
    );
  }, []);

  return (
    <div
      className="Blogs h-screen relative flex flex-col justify-around items-center py-16 md:py-24"
      id={containerId}
    >
      <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-norepeat- bg-cover"></div>
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>

      <header className="text-3xl md:text-5xl text-white font-bold relative z-[3] text-center px-4">
        Blogs
        <div className="underline-below-header absolute w-3/5 h-1 bg-[var(--accent-blue)] bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </header>
      <div className="blog-content rounded-xl max-w-[90vw] border border-[var(--border-color)] bg-[#1A1D24]/70 backdrop-blur-sm p-4 h-1/2 sm:w-80 md:w-96 flex flex-col items-center justify-center text-2xl text-[var(--text-light)] text-center z-[3] font-oregano opacity-0">
        Integration Coming Soon...
        <br />
        For now Visit my blog directly!
        <a
          href="https://xauravww.hashnode.dev"
          target="_blank"
          className="bg-[var(--accent-blue)] text-[#1A1D24] mt-5 font-extralight p-3 rounded hover:opacity-90 transition-opacity"
        >
          Blog Link
        </a>
      </div>
    </div>
  );
};

Blogs.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default Blogs;
