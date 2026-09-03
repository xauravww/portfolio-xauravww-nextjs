'use client';
import React, { useState, useEffect } from 'react';

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let timerId;
    const handleMouseMove = (event) => {
      //   console.log("event.pageX : ",event.pageX)
      //  console.log("event.pageY : ",event.pageY)
      // setPosition({x:event.pageX-200,y:event.pageY-200})
      // to make it even more cleaner i will use the transform instead of guess work
      // using clientX and clientY so that our code will not create bugs if anytime we add scroll , it always depend on viewport

      //adding slight throttle for safety
      if (timerId) return
      timerId = setTimeout(() => {
        setPosition({ x: event.clientX, y: event.clientY })
        timerId = null
      }, 10)

    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timerId)
    }
  }, [])

  const glowStyle = {
    position: "fixed",
    top: position.y,
    left: position.x,
    height: "400px",
    width: "400px",
    borderRadius: "50%",
    background: `radial-gradient(circle, rgba(74, 144, 226, 0.15) 0%, transparent 70%)`,
    transform: "translate(-50%,-50%)",
    transition: "top 0.1s ease-out, left 0.1s ease-out"

  }
  return <div style={glowStyle} />;
};

export default CursorGlow;