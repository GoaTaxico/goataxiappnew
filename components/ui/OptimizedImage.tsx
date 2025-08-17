'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createIntersectionObserver, lazyLoadImage } from '@/utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  quality?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder,
  fallback = '/images/placeholder.jpg',
  onLoad,
  onError,
  loading = 'lazy',
  sizes,
  quality = 80,
  fill = false,
  style,
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    if (!imgRef.current) return;

    const observer = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!isInView) return;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        if (imgRef.current) {
          await lazyLoadImage(imgRef.current, imageSrc, placeholder);
        }

        setIsLoading(false);
        onLoad?.();
      } catch (error) {
        console.error('Failed to load image:', error);
        setHasError(true);
        setIsLoading(false);
        onError?.();
      }
    };

    loadImage();
  }, [imageSrc, isInView, placeholder, onLoad, onError]);

  const handleError = () => {
    if (!hasError && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(true);
    }
  };

  if (fill) {
    return (
      <div className={`relative ${className}`} style={style}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        <Image
          ref={imgRef as any}
          src={imageSrc}
          alt={alt}
          fill
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          priority={priority}
          loading={loading}
          sizes={sizes}
          quality={quality}
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      <Image
        ref={imgRef as any}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        loading={loading}
        sizes={sizes}
        quality={quality}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={handleError}
      />
    </div>
  );
};

// Avatar component for user/driver avatars
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback = '/images/default-avatar.png',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <OptimizedImage
      src={src || fallback}
      alt={alt}
      width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
      height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      fallback={fallback}
      priority={true}
    />
  );
};

// Thumbnail component for smaller images
interface ThumbnailProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  src,
  alt,
  width = 100,
  height = 100,
  className = '',
  fallback = '/images/placeholder-thumbnail.jpg',
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      fallback={fallback}
      loading="lazy"
    />
  );
};

// Hero image component for large images
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({
  src,
  alt,
  className = '',
  fallback = '/images/placeholder-hero.jpg',
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      fallback={fallback}
      priority={true}
      sizes="100vw"
    />
  );
};
