// components/common/ThreeDotsLoader.tsx
import React from "react";

interface ThreeDotsLoaderProps {
  color?: string; // Color class for the dots
  size?: "sm" | "md" | "lg"; // Size variants
}

export const ThreeDotsLoader: React.FC<ThreeDotsLoaderProps> = ({
  color = "bg-yellow-500",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-1.5 h-1.5 mx-0.5",
    md: "w-2 h-2 mx-0.5",
    lg: "w-3 h-3 mx-1"
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizeClasses[size]} ${color} rounded-full animate-pulse`}
        style={{ animationDelay: '0ms' }}
      />
      <div 
        className={`${sizeClasses[size]} ${color} rounded-full animate-pulse`}
        style={{ animationDelay: '150ms' }}
      />
      <div 
        className={`${sizeClasses[size]} ${color} rounded-full animate-pulse`}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};

// Alternative with keyframes for more control
export const ThreeDotsLoaderAlt: React.FC<ThreeDotsLoaderProps> = ({
  color = "bg-yellow-500",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3"
  };

  return (
    <div className="flex items-center space-x-1">
      <span className="sr-only">Loading...</span>
      <div className="flex items-center space-x-1">
        <div 
          className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        />
        <div 
          className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
          style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
        />
        <div 
          className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
          style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
        />
      </div>
    </div>
  );
};

export default ThreeDotsLoader;