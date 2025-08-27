'use client';
import React, { useState, useEffect, useRef } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
// Remove direct import - use public folder reference instead
import { navbarContext } from "../context/navbarContext";
import { gsap } from "gsap";

const Navbar = () => {
  const { navbarToggleState, setNavbarToggleState } = React.useContext(navbarContext);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeSection, setActiveSection] = useState("section1");
  const navOverlayRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsNavbarVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    const handleClickOutside = (event) => {
      const hamburgerButton = document.querySelector('.hamburger');
      if (
        navOverlayRef.current &&
        !navOverlayRef.current.contains(event.target) &&
        hamburgerButton &&
        !hamburgerButton.contains(event.target)
      ) {
        setNavbarToggleState(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [prevScrollPos, setNavbarToggleState]);

  useEffect(() => {
    if (navbarToggleState) {
      gsap.fromTo(".overlay-item",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "power2.out" }
      );
    } else {
      gsap.set(".overlay-item", { opacity: 0 });
    }
  }, [navbarToggleState]);

  const handleSetActive = (to) => {
    setActiveSection(to);
  };

  return (
    <div
      className={`sticky nav-container bg-[#1A1D24] z-[30] relative transition-all duration-300 ${isNavbarVisible ? 'opacity-100' : 'opacity-0 -translate-y-full'}`}
    >
      {/* Mobile Overlay */}
      <div
        ref={navOverlayRef}
        className={`fixed nav-overlay inset-0 bg-[#1A1D24]/90 backdrop-blur-lg z-[40] flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          navbarToggleState ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <button
          className="absolute top-5 right-5 text-[#F0F0F0] text-3xl"
          onClick={() => setNavbarToggleState(false)}
          aria-label="Close menu"
        >
          &times;
        </button>
        <ul className="flex flex-col items-center w-full px-8">
          {[
            { name: "Home", section: "section1" },
            { name: "TechStack", section: "section2" },
            { name: "Projects", section: "section3" },
            { name: "Experience", section: "section4" },
            { name: "Blogs", section: "section5" },
            { name: "Education", section: "section6" },
            { name: "Contact", section: "section7" }
          ].map((item) => (
            <li key={item.name} className="overlay-item w-full text-center opacity-0">
              <Link
                activeClass="active-mobile-link"
                to={item.section}
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                onClick={() => setNavbarToggleState(false)}
                className={`block py-4 text-2xl transition-colors duration-200 ${
                  activeSection === item.section 
                    ? "text-[#4A90E2] font-semibold" 
                    : "text-[#F0F0F0] hover:text-[#4A90E2]"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop Navbar (Add blur and transparent background) */}
      <div className="fixed top-5 rounded-full left-1/2 transform -translate-x-1/2 bg-[#1A1D24]/80 backdrop-blur-md border border-[#33373E] z-[30] navbar px-8 py-2 h-[4rem] max-w-fit flex justify-center items-center shadow-lg">
        <ul className="nav-items hidden md:flex gap-4 text-white px-4 py-2 cursor-pointer text-xl md:text-2xl">
          {[
            { name: "Home", section: "section1", offset: -100 },
            { name: "TechStack", section: "section2", offset: 0 },
            { name: "Projects", section: "section3", offset: 0 },
            { name: "Experience", section: "section4", offset: 0 },
            { name: "Blogs", section: "section5", offset: 0 },
            { name: "Education", section: "section6", offset: 0 },
            { name: "Contact", section: "section7", offset: 0 }
          ].map((item) => (
            <li key={item.name} className="li-item relative after:absolute after:bg-[#fff] after:content-[''] after:h-1 after:w-0 after:left-0 after:bottom-[-10px] hover:after:w-full after:transition-all after:duration-300 after:ease-in-out">
              <Link
                activeClass="active"
                to={item.section}
                spy={true}
                smooth={true}
                offset={item.offset}
                duration={500}
                onSetActive={handleSetActive}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="hamburger cursor-pointer w-8 h-8 md:hidden text-[#F0F0F0] flex items-center justify-center"
          onClick={() => setNavbarToggleState(!navbarToggleState)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <button
        className="h-10 w-10 fixed bottom-10 right-10 z-[20] border-4 border-[#4A90E2] rounded-full bg-[#1A1D24]/80 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 hover:bg-[#4A90E2]/20"
        onClick={() => scroll.scrollToTop()}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default Navbar;