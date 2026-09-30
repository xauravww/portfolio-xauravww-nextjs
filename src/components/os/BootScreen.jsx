'use client';

import { useState, useEffect, useRef } from 'react';

const BootScreen = ({ onComplete }) => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    
const intervalId = setInterval(() => {
      setCount((prev) => {
        if (prev < 5) {
          return prev + 1
        }
     if(onComplete) onComplete()
      return prev
      })
    },150)

  return () => clearInterval(intervalId);


  }, [])

    return (
      <div className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1c1c1e]'>
        {/* Logo */}
        <div className='text-6xl font-semibold'>
          SM
        </div>

        {/* Progress Bar */}
        <div className='h-2 w-50 bg-gray-700 mt-2 rounded-full relative'>
          {/* Progress Fill */}
          <div
            className="absolute bg-red-100 h-2 rounded-full"
            style={{ width: `${20 * count}%` }}
          ></div>

        </div>
      </div>
    )
  };

  export default BootScreen;
