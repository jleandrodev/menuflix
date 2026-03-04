"use client";
// src/components/category-bar.tsx
// Horizontal scrollable category filter bar

import { cn } from "@/lib/utils";

interface CategoryBarProps {
  categories: Array<{ id: string; name: string }>;
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryBar({
  categories,
  activeCategory,
  onCategorySelect,
}: CategoryBarProps) {
  if (categories.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-30">
      <div className="bg-gradient-to-b from-black/70 to-transparent pt-3 pb-6 px-4">
        <nav className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {/* "Todos" option */}
          <button
            onClick={() => onCategorySelect(null)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95",
              activeCategory === null
                ? "bg-white text-black shadow-lg shadow-white/20"
                : "bg-white/15 text-white/90 backdrop-blur-sm border border-white/10 hover:bg-white/25"
            )}
          >
            Todos
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-95",
                activeCategory === cat.id
                  ? "bg-white text-black shadow-lg shadow-white/20"
                  : "bg-white/15 text-white/90 backdrop-blur-sm border border-white/10 hover:bg-white/25"
              )}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
