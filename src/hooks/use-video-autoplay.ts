"use client";
// src/hooks/use-video-autoplay.ts
// Hook for autoplay via IntersectionObserver

import { useEffect, useRef, useCallback } from "react";

interface UseVideoAutoplayOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useVideoAutoplay(options: UseVideoAutoplayOptions = {}) {
  const { threshold = 0.7, rootMargin = "0px" } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      const video = videoRef.current;
      if (!video) return;

      if (entry.isIntersecting) {
        video.play().catch(() => {
          // Autoplay blocked by browser — expected on some mobile browsers
        });
      } else {
        video.pause();
      }
    },
    []
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(video);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { videoRef };
}
