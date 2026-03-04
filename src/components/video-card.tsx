"use client";
// src/components/video-card.tsx
// Individual video card item in the feed

import { useRef, useEffect, useCallback, useState } from "react";
import { DishOverlay } from "./dish-overlay";
import { Volume2, VolumeX, Play } from "lucide-react";
import type { FeedDishOutput } from "@/application/dtos/feed.dto";

interface VideoCardProps {
  dish: FeedDishOutput;
  isActive: boolean;
  onVisible: (id: string) => void;
  onRateClick: (dishId: string) => void;
  onViewed?: (dishId: string) => void;
}

export function VideoCard({
  dish,
  isActive,
  onVisible,
  onRateClick,
  onViewed,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const viewTracked = useRef(false);

  // IntersectionObserver for autoplay
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          onVisible(dish.id);
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [dish.id, onVisible]);

  // Play/pause based on active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      video.play().then(() => {
        setIsPlaying(true);
        // Track view
        if (!viewTracked.current && onViewed) {
          viewTracked.current = true;
          onViewed(dish.id);
        }
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, dish.id, onViewed]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }

    // Flash play/pause icon
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 600);
  }, []);

  return (
    <div
      ref={containerRef}
      id={`feed-video-${dish.id}`}
      className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-black"
    >
      {/* Video */}
      {dish.videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={dish.videoUrl}
          poster={dish.thumbnailUrl || undefined}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onClick={togglePlayPause}
        />
      ) : (
        /* Fallback thumbnail or placeholder */
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: dish.thumbnailUrl
              ? `url(${dish.thumbnailUrl})`
              : "none",
            backgroundColor: "#1a1a2e",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/50">
              <Play className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">Vídeo em breve</p>
            </div>
          </div>
        </div>
      )}

      {/* Play/Pause flash icon */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center animate-ping-once">
            {isPlaying ? (
              <Play className="w-10 h-10 text-white fill-white" />
            ) : (
              <div className="flex gap-1">
                <div className="w-3 h-10 bg-white rounded-sm" />
                <div className="w-3 h-10 bg-white rounded-sm" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all active:scale-90"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Dish info overlay */}
      <DishOverlay
        name={dish.name}
        description={dish.description}
        priceFormatted={dish.priceFormatted}
        averageRating={dish.averageRating}
        ratingCount={dish.ratingCount}
        highlighted={dish.highlighted}
        onRateClick={() => onRateClick(dish.id)}
      />
    </div>
  );
}
