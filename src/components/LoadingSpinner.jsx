"use client";

const LoadingSpinner = ({ text = "Loading...", className = "" }) => {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-[#f3d800] rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-[#f3d800]/50 rounded-full animate-spin"
            style={{animationDirection: 'reverse', animationDuration: '1s'}}
          ></div>
        </div>
        {/* Loading Text */}
        <div className="text-white text-lg font-medium">
          {text}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;