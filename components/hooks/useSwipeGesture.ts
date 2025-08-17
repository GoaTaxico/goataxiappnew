'use client';

import { useEffect, useRef, useState } from 'react';

interface SwipeConfig {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) {
  const { minSwipeDistance = 50, maxSwipeTime = 300 } = config;
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      // Prevent scrolling during swipe
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      if (!touch) return;
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Check if swipe meets criteria
      if (deltaTime < maxSwipeTime) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > minSwipeDistance || absDeltaY > minSwipeDistance) {
          // Determine swipe direction
          if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0 && handlers.onSwipeRight) {
              handlers.onSwipeRight();
            } else if (deltaX < 0 && handlers.onSwipeLeft) {
              handlers.onSwipeLeft();
            }
          } else {
            // Vertical swipe
            if (deltaY > 0 && handlers.onSwipeDown) {
              handlers.onSwipeDown();
            } else if (deltaY < 0 && handlers.onSwipeUp) {
              handlers.onSwipeUp();
            }
          }
        }
      }

      touchStartRef.current = null;
      setIsSwiping(false);
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handlers, minSwipeDistance, maxSwipeTime]);

  return { isSwiping };
}
