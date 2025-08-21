'use client';
import PropTypes from "prop-types";
import React, { useState, useEffect } from 'react';
// Remove direct imports - use public folder references instead
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ContactMe = ({ containerId }) => {
    const sidebarImgCSS = "sidebar-img w-16 hover:scale-125 transition-transform duration-300";
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        query: ''
    });
    const [loader, setLoader] = useState(false);
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        query: ''
    });

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            name: '',
            email: '',
            query: ''
        };

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
            valid = false;
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
            valid = false;
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
            valid = false;
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
            valid = false;
        }

        if (!formData.query.trim()) {
            errors.query = 'Message is required';
            valid = false;
        } else if (formData.query.trim().length < 10) {
            errors.query = 'Message must be at least 10 characters';
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoader(true);
        try {
            const response = await axios.post(`${process.env.VITE_BACKEND_URL}/api/queries`, formData);
            toast.success('Your message has been sent successfully! I\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                query: ''
            });
        } catch (error) {
            console.error('There was an error submitting your query:', error);
            if (error.response && error.response.status === 429) {
                toast.error('Too many requests. Please try again later.');
            } else {
                toast.error('Failed to send message. Please try again or contact me directly.');
            }
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".contact-form-container",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ContactMe",
            start: "top 70%",
          }
        }
      );
      
      gsap.fromTo(".contact-sidebar",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.3,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".ContactMe",
            start: "top 70%",
          }
        }
      );
    }, []);

    return (
        <div
            className="ContactMe min-h-screen relative flex flex-col justify-evenly items-center overflow-hidden py-16 md:py-24"
            id={containerId}
        >
            <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-norepeat- bg-cover"></div>
            <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>

            <header className="text-3xl md:text-5xl text-white font-bold relative z-[3] text-center px-4 mb-8">
                Contact Me
                <div className="underline-below-header absolute w-3/5 h-1 bg-[#4A90E2] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
            </header>

            <div className="contact-form-container main-content border border-[#33373E] bg-[#1A1D24]/70 backdrop-blur-sm p-6 flex flex-col items-center justify-center w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[800px] xl:max-w-[900px] text-[#F0F0F0] text-center z-[3] rounded-xl shadow-lg opacity-0">
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-xl lg:text-2xl font-medium mb-2 text-[#F0F0F0] text-left">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength="30"
                            placeholder="Your Name"
                            className={`bg-[#33373E] border-2 ${formErrors.name ? 'border-red-500' : 'border-[#33373E]'} text-[#F0F0F0] placeholder:text-[#A0A0A0] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all duration-200`}
                            aria-describedby="nameError"
                        />
                        {formErrors.name && (
                            <p id="nameError" className="text-red-500 text-sm mt-1 text-left">{formErrors.name}</p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-xl lg:text-2xl font-medium mb-2 text-[#F0F0F0] text-left">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                            className={`bg-[#33373E] border-2 ${formErrors.email ? 'border-red-500' : 'border-[#33373E]'} text-[#F0F0F0] placeholder:text-[#A0A0A0] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all duration-200`}
                            maxLength="50"
                            aria-describedby="emailError"
                        />
                        {formErrors.email && (
                            <p id="emailError" className="text-red-500 text-sm mt-1 text-left">{formErrors.email}</p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="query" className="text-xl lg:text-2xl font-medium mb-2 text-[#F0F0F0] text-left">Message</label>
                        <textarea
                            id="query"
                            name="query"
                            value={formData.query}
                            onChange={handleChange}
                            required
                            rows="4"
                            maxLength="500"
                            placeholder="Your message here..."
                            className={`bg-[#33373E] border-2 ${formErrors.query ? 'border-red-500' : 'border-[#33373E]'} text-[#F0F0F0] placeholder:text-[#A0A0A0] resize-none p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all duration-200`}
                            aria-describedby="queryError"
                        />
                        {formErrors.query && (
                            <p id="queryError" className="text-red-500 text-sm mt-1 text-left">{formErrors.query}</p>
                        )}
                        <p className="text-right text-sm text-[var(--text-medium)] mt-1">{formData.query.length}/500</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loader}
                        className={`w-full bg-[var(--accent-blue)] text-white py-3 px-6 rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-blue)] transition duration-300 ease-in-out ${loader ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loader ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </span>
                        ) : "Send Message"}
                    </button>
                </form>
            </div>

            {/* Mobile social links */}
            <div className="contact-sidebar sidebar-wrapper z-50 lg:hidden mt-8 opacity-0">
                <div className="sidebar flex justify-center items-center gap-4 border-2 border-[var(--border-color)] p-3 bg-[#33373E]/50 backdrop-blur-sm rounded-md">
                    <a href={process.env.NEXT_PUBLIC_X_URL} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                        <img className={sidebarImgCSS} src="/assets/X.jpeg" alt="X" />
                    </a>
                    <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <img className={sidebarImgCSS} src="/assets/linkedin.png" alt="LinkedIn" />
                    </a>
                    <a href={process.env.NEXT_PUBLIC_SHOWWCASE_URL} target="_blank" rel="noopener noreferrer" aria-label="Showwcase">
                        <img className={sidebarImgCSS} src="/assets/showwcase.png" alt="Showwcase" />
                    </a>
                </div>
            </div>

            {/* Desktop social links */}
            <div className="contact-sidebar hidden sidebar-wrapper fixed top-[40vh] left-8 z-50 flex-col justify-center items-center lg:flex lg:w-[4vw] opacity-0">
                <div className="sidebar flex flex-col justify-center items-center gap-4 border-2 border-[var(--border-color)] p-3 bg-[#33373E]/50 backdrop-blur-sm rounded-md shadow-lg">
                    <a href={process.env.NEXT_PUBLIC_X_URL} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:scale-110 transition-transform duration-300">
                        <img className={sidebarImgCSS} src="/assets/X.jpeg" alt="X" />
                    </a>
                    <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 transition-transform duration-300">
                        <img className={sidebarImgCSS} src="/assets/linkedin.png" alt="LinkedIn" />
                    </a>
                    <a href={process.env.NEXT_PUBLIC_SHOWWCASE_URL} target="_blank" rel="noopener noreferrer" aria-label="Showwcase" className="hover:scale-110 transition-transform duration-300">
                        <img className={sidebarImgCSS} src="/assets/showwcase.png" alt="Showwcase" />
                    </a>
                </div>
            </div>

            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
        </div>
    );
};

ContactMe.propTypes = {
    containerId: PropTypes.string.isRequired,
};

export default ContactMe;