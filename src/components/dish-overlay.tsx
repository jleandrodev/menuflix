"use client";
// src/components/dish-overlay.tsx
// Overlay with dish info over the video

import { Star } from "lucide-react";

interface DishOverlayProps {
  name: string;
  description: string;
  priceFormatted: string;
  averageRating: number;
  ratingCount: number;
  highlighted: boolean;
  onRateClick?: () => void;
}

export function DishOverlay({
  name,
  description,
  priceFormatted,
  averageRating,
  ratingCount,
  highlighted,
  onRateClick,
}: DishOverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
      {/* Gradient overlay */}
      <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-24 pb-6 px-5">
        <div className="pointer-events-auto">
          {/* Highlight badge */}
          {highlighted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-amber-500/90 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-white text-white" />
              <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                Destaque
              </span>
            </div>
          )}

          {/* Dish name */}
          <h2 className="text-2xl font-bold text-white leading-tight mb-1 drop-shadow-lg">
            {name}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-sm text-white/80 leading-relaxed mb-3 line-clamp-2 max-w-[85%]">
              {description}
            </p>
          )}

          {/* Price + Rating row */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-emerald-400 drop-shadow-md">
              {priceFormatted}
            </span>

            <button
              onClick={onRateClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all active:scale-95"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-white">
                {averageRating > 0 ? averageRating.toFixed(1) : "—"}
              </span>
              {ratingCount > 0 && (
                <span className="text-xs text-white/60">({ratingCount})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
