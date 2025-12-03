import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number; 
  delay?: number; 
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 100,
  delay = 500,
}: UseInfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const lastLoadTimeRef = useRef<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(() => {
    const now = Date.now();
    
    // Prevent too frequent loads
    if (now - lastLoadTimeRef.current < delay) {
      return;
    }
    
    if (hasMore && !loading && !isLoadingMore) {
      lastLoadTimeRef.current = now;
      setIsLoadingMore(true);
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore, delay, isLoadingMore]);

  useEffect(() => {
    if (!loading) {
      setIsLoadingMore(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, handleLoadMore, threshold]);

  // Handle scroll events as fallback
  useEffect(() => {
    if (!hasMore || loading) return;

    const handleScroll = () => {
      if (!loadMoreTriggerRef.current) return;
      
      const triggerRect = loadMoreTriggerRef.current.getBoundingClientRect();
      const isNearBottom = triggerRect.top <= window.innerHeight + threshold;
      
      if (isNearBottom) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, handleLoadMore, threshold]);

  return {
    loadMoreTriggerRef,
    isLoadingMore,
  };
};