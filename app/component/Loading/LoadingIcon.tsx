import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ size = 'large' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-8 w-8';
      case 'large':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className={`animate-spin border-t-4 border-blue-600 ${getSizeClasses()} rounded-full`}></div>
    </div>
  );
};

export default Loading;
