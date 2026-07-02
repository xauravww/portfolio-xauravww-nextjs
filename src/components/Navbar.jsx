'use client';
import React, { useState, useEffect, useRef } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import { navbarContext } from "../context/navbarContext";
import { gsap } from "gsap";

const NAV_ITEMS = [
  { name: "Home", section: "home" },
  { name: "About", section: "about" },
  { name: "Tech Stack", section: "techstack" },
  { name: "Projects", section: "projects" },
  { name: "Experience", section: "experience" },
  { name: "Blogs", section: "blogs" },
  { name: "Education", section: "education" },
  { name: "Contact", section: "contact" },
];

const Navbar = () => {
  const { navbarToggleState, setNavbarToggleState } = React.useContext(navbarContext);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const navOverlayRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsNavbarVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setIsScrolled(currentScrollPos > 50);
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
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
      );
    } else {
      gsap.set(".overlay-item", { opacity: 0 });
    }
  }, [navbarToggleState]);

  return (
    <>
      {/* Desktop + Mobile Top Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[30] transition-all duration-300 ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-surface/85 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <Link
              to="home"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className="cursor-pointer flex items-center gap-1"
            >
              <span className="text-gold font-display text-xl font-bold tracking-tight">SM</span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    activeClass="active"
                    to={item.section}
                    spy={true}
                    smooth={true}
                    offset={item.section === 'home' ? -100 : 0}
                    duration={500}
                    onSetActive={(to) => setActiveSection(to)}
                    className={`relative px-3 py-1.5 text-xs font-medium tracking-wide uppercase cursor-pointer transition-colors duration-200 ${
                      activeSection === item.section
                        ? 'text-gold'
                        : 'text-body hover:text-heading'
                    }`}
                  >
                    {item.name}
                    {activeSection === item.section && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Hamburger */}
            <button
              className="hamburger md:hidden w-8 h-8 text-heading flex items-center justify-center cursor-pointer"
              onClick={() => setNavbarToggleState(!navbarToggleState)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        ref={navOverlayRef}
        className={`fixed inset-0 z-[40] transition-all duration-300 md:hidden ${
          navbarToggleState ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
        <div className="relative h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 h-14">
            <span className="text-gold font-display text-xl font-bold tracking-tight">SM</span>
            <button
              className="w-8 h-8 text-heading flex items-center justify-center"
              onClick={() => setNavbarToggleState(false)}
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex-1 flex flex-col justify-center px-8">
            {NAV_ITEMS.map((item, i) => (
              <div key={item.name} className="overlay-item opacity-0">
                <Link
                  to={item.section}
                  spy={true}
                  smooth={true}
                  offset={0}
                  duration={500}
                  onClick={() => setNavbarToggleState(false)}
                  className={`block py-3 text-lg font-medium transition-colors duration-200 ${
                    activeSection === item.section
                      ? 'text-gold'
                      : 'text-body hover:text-heading'
                  }`}
                >
                  <span className="text-gold/40 text-xs font-mono mr-3">0{i + 1}</span>
                  {item.name}
                </Link>
                {i < NAV_ITEMS.length - 1 && <div className="border-b border-border/30" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        className={`h-9 w-9 fixed bottom-8 right-8 z-[20] border border-gold/30 rounded-full bg-surface/70 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gold/15 hover:border-gold/50 ${
          prevScrollPos > 300 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        onClick={() => scroll.scrollToTop()}
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </>
  );
};

export default Navbar;
