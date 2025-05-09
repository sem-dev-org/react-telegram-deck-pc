import React, { useState, useEffect } from 'react';

interface ImageProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  fallbackSrc = '/images/cyan-blur.png', // 默认的占位图
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setImgSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setImgSrc(fallbackSrc);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`h-full w-full object-cover transition-opacity duration-300 ${className} ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};
