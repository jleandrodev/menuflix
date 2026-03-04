"use client";
// src/components/video-feed.tsx
// Main video feed component (TikTok/Reels style) with Profile Grid
import { useState, useCallback, useMemo } from "react";
import { VideoCard } from "./video-card";
import { CategoryBar } from "./category-bar";
import { RatingPopup } from "./rating-popup";
import { CallWaiterButton } from "./call-waiter-button";
import { incrementViewAction } from "@/lib/server-actions/feed.actions";
import { Button } from "./ui/button";
import { Star, Grid3X3, PlaySquare, Heart, MapPin, Search, ChevronRight } from "lucide-react";
import type { FeedDishOutput, FeedCategoryOutput } from "@/application/dtos/feed.dto";

interface VideoFeedProps {
  dishes: FeedDishOutput[];
  categories: FeedCategoryOutput[];
  restaurantSlug: string;
  restaurantName: string;
}

export function VideoFeed({
  dishes,
  categories,
  restaurantSlug,
  restaurantName,
}: VideoFeedProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [ratingDish, setRatingDish] = useState<{ id: string; name: string } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");

  // Filter dishes by category (only applies in feed mode or if we want category bar in grid too)
  const filteredDishes = useMemo(() => {
    if (!activeCategory) return dishes;
    return dishes.filter((d) => d.categoryId === activeCategory);
  }, [dishes, activeCategory]);

  const handleVisible = useCallback((id: string) => {
    setActiveVideoId(id);
  }, []);

  const handleRateClick = useCallback(
    (dishId: string) => {
      const dish = dishes.find((d) => d.id === dishId);
      if (dish) {
        setRatingDish({ id: dish.id, name: dish.name });
      }
    },
    [dishes]
  );

  const handleViewed = useCallback((dishId: string) => {
    incrementViewAction(dishId).catch(() => {});
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setActiveCategory(categoryId);
    // Scroll to top when category changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openFeedMode = (dishId: string) => {
    setActiveVideoId(dishId);
    setViewMode("feed");
    
    // Auto-scroll to selected video when opening
    setTimeout(() => {
       const el = document.getElementById(`feed-video-${dishId}`);
       if (el) el.scrollIntoView({ behavior: 'instant' });
    }, 50);
  };

  const closeFeedMode = () => {
    setViewMode("grid");
    setActiveVideoId(null);
  };

  if (viewMode === "feed") {
    if (filteredDishes.length === 0) {
      return (
        <div className="h-[100dvh] bg-[#0C0A15] flex items-center justify-center">
          <Button variant="ghost" className="absolute top-4 left-4 z-50 text-white" onClick={closeFeedMode}>
            Voltar ao Perfil
          </Button>
          <div className="text-center text-white/50 px-8">
            <p className="text-5xl mb-4">🍽️</p>
            <h2 className="text-xl font-semibold text-white/70 mb-2">
              Nenhum prato encontrado
            </h2>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-[#0C0A15]">
        {/* Close Feed Mode Button */}
        <div className="absolute top-4 left-4 z-40">
          <Button variant="ghost" size="icon" className="text-white bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-colors" onClick={closeFeedMode}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>

        {/* Vertical scroll snap feed */}
        <div className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {filteredDishes.map((dish) => (
            <VideoCard
              key={dish.id}
              dish={dish}
              isActive={activeVideoId === dish.id}
              onVisible={handleVisible}
              onRateClick={handleRateClick}
              onViewed={handleViewed}
            />
          ))}
        </div>

        {/* Floating Call Waiter for Feed */}
        <CallWaiterButton slug={restaurantSlug} />

        {/* Rating popup */}
        <RatingPopup
          dishId={ratingDish?.id ?? ""}
          dishName={ratingDish?.name ?? ""}
          isOpen={ratingDish !== null}
          onClose={() => setRatingDish(null)}
        />
      </div>
    );
  }

  // Calculate stats for the profile
  const totalRatings = dishes.reduce((acc, dish) => acc + (dish.ratingCount || 0), 0);
  const avgRatingOverall = dishes.length > 0
    ? (dishes.reduce((acc, dish) => acc + (dish.averageRating || 0), 0) / dishes.length).toFixed(1)
    : "0.0";

  // Desktop / Minimalist Header Layout
  return (
    <div className="min-h-screen bg-[#06040A] text-white">
      {/* Header - Elegant Minimalist */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl border border-white/10 p-1 relative overflow-hidden bg-gradient-to-br from-[#E11D48]/50 to-[#8B5CF6]/50 shadow-2xl">
            <div className="w-full h-full rounded-xl bg-[#1A1525] flex items-center justify-center text-4xl font-bold bg-cover bg-center" style={{ backgroundImage: `url('/images/restaurant-placeholder.jpg')` }}>
               {restaurantName.charAt(0)}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{restaurantName}</h1>
            <p className="text-white/60 text-sm md:text-base mb-4 max-w-lg mx-auto md:mx-0">
               Menu digital interativo. Explore nossos vídeos, pratos em destaque e faça seu pedido.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-white/80">
               <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                 <span className="font-medium">{avgRatingOverall}</span>
                 <span className="text-white/40">({totalRatings})</span>
               </div>
               <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                 <MapPin className="w-4 h-4 text-white/50" />
                 <span>São Paulo, SP</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destaques (Highlights) Carousel */}
      {dishes.filter(d => d.highlighted).length > 0 && (
         <div className="max-w-5xl mx-auto px-4 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Destaques da Casa</h2>
              <div className="text-sm text-[#E11D48] flex items-center gap-1 cursor-pointer font-medium hover:text-[#E11D48]/80 transition-colors">
                Ver todos <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
               {dishes.filter(d => d.highlighted).map(dish => (
                  <div 
                    key={dish.id}
                    onClick={() => openFeedMode(dish.id)} 
                    className="shrink-0 w-64 md:w-72 rounded-2xl bg-[#130F1C] border border-white/5 overflow-hidden cursor-pointer group snap-center"
                  >
                     <div className="aspect-video relative overflow-hidden">
                        {dish.videoUrl ? (
                          <video src={dish.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" poster={dish.thumbnailUrl ?? undefined} />
                        ) : dish.thumbnailUrl ? (
                          <img src={dish.thumbnailUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-[#1A1525] flex items-center justify-center">
                              <PlaySquare className="w-10 h-10 text-white/20" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium border border-white/10 flex items-center gap-1">
                           <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                           {dish.averageRating}
                        </div>
                     </div>
                     <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                           <h3 className="font-semibold line-clamp-1 group-hover:text-[#E11D48] transition-colors">{dish.name}</h3>
                           <span className="font-bold text-[#10B981] whitespace-nowrap">{dish.priceFormatted}</span>
                        </div>
                        <p className="text-xs text-white/50 line-clamp-2">{dish.description}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Categories & Full Menu */}
      <div className="max-w-5xl mx-auto px-0 md:px-4 mb-24">
         <div className="sticky top-0 z-30 bg-[#06040A]/90 backdrop-blur-xl border-b border-white/5 pb-2 pt-2 px-4 md:px-0">
           <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === null ? 'bg-[#E11D48] text-white' : 'bg-[#130F1C] border border-white/10 hover:bg-white/10 text-white/80'}`}
              >
                Todos
              </button>
              {categories.map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => setActiveCategory(cat.id)}
                   className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-[#E11D48] text-white' : 'bg-[#130F1C] border border-white/10 hover:bg-white/10 text-white/80'}`}
                 >
                   {cat.name}
                 </button>
              ))}
           </nav>
         </div>

         {/* Menu Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-0 mt-6">
            {filteredDishes.map(dish => (
               <div 
                 key={dish.id}
                 onClick={() => openFeedMode(dish.id)}
                 className="flex h-32 rounded-2xl bg-[#130F1C] border border-white/5 overflow-hidden cursor-pointer group hover:bg-[#1A1525] transition-colors"
               >
                 <div className="w-32 h-full shrink-0 relative overflow-hidden bg-[#1A1525]">
                    {dish.videoUrl ? (
                      <video src={dish.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" poster={dish.thumbnailUrl ?? undefined} />
                    ) : dish.thumbnailUrl ? (
                      <img src={dish.thumbnailUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                          <PlaySquare className="w-8 h-8 text-white/10" />
                      </div>
                    )}
                 </div>
                 <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                       <h3 className="font-semibold text-sm line-clamp-1 mb-0.5">{dish.name}</h3>
                       <p className="text-xs text-white/50 line-clamp-2">{dish.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <span className="font-bold text-sm text-white/90">{dish.priceFormatted}</span>
                       {dish.averageRating > 0 && (
                          <div className="flex items-center gap-1 text-xs text-white/60">
                             <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                             {dish.averageRating}
                          </div>
                       )}
                    </div>
                 </div>
               </div>
            ))}
            
            {filteredDishes.length === 0 && (
               <div className="col-span-full py-12 text-center text-white/50">
                  <p>Nenhum prato encontrado nesta categoria.</p>
               </div>
            )}
         </div>
      </div>
      
      {/* Floating Action CTA */}
      <CallWaiterButton slug={restaurantSlug} />
    </div>
  );
}
