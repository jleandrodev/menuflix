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
            
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x">
               {dishes.filter(d => d.highlighted).map(dish => (
                  <div 
                    key={dish.id}
                    onClick={() => openFeedMode(dish.id)} 
                    className="shrink-0 w-48 md:w-56 aspect-[9/16] relative bg-[#130F1C] overflow-hidden cursor-pointer group snap-center"
                  >
                     {/* Background */}
                     <div className="absolute inset-0 z-0">
                        {dish.videoUrl ? (
                          <video src={dish.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" poster={dish.thumbnailUrl ?? undefined} />
                        ) : dish.thumbnailUrl ? (
                          <img src={dish.thumbnailUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-[#1A1525] flex items-center justify-center">
                              <PlaySquare className="w-10 h-10 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                     </div>
                     
                     {/* Top Right */}
                     <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
                        <div className="bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-sm text-[10px] font-bold border border-white/10 flex items-center gap-1 shadow-lg">
                           <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                           {dish.averageRating}
                        </div>
                        <div className="bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-sm text-[10px] font-medium border border-white/10 flex items-center gap-1 shadow-lg">
                           <PlaySquare className="w-2.5 h-2.5 text-white/70" />
                           {dish.viewCount > 1000 ? `${(dish.viewCount / 1000).toFixed(1)}k` : dish.viewCount}
                        </div>
                     </div>

                     {/* Bottom Left */}
                     <div className="absolute bottom-3 left-3 z-10 right-3">
                        <h3 className="font-bold text-sm md:text-base text-white drop-shadow-md line-clamp-1 leading-tight mb-1 transition-colors">{dish.name}</h3>
                        <div className="flex">
                           <span className="font-bold text-xs md:text-sm text-white/90 drop-shadow-md bg-[#E11D48] px-2 py-1">
                             {dish.priceFormatted}
                           </span>
                        </div>
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
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5 md:gap-1 mt-6">
            {filteredDishes.map(dish => (
               <div 
                 key={dish.id}
                 onClick={() => openFeedMode(dish.id)}
                 className="relative aspect-[9/16] bg-[#130F1C] overflow-hidden cursor-pointer group"
               >
                 {/* Background Image / Video */}
                 <div className="absolute inset-0 z-0">
                    {dish.videoUrl ? (
                      <video src={dish.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" poster={dish.thumbnailUrl ?? undefined} />
                    ) : dish.thumbnailUrl ? (
                      <img src={dish.thumbnailUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1A1525]">
                          <PlaySquare className="w-8 h-8 text-white/10" />
                      </div>
                    )}
                    {/* Shadow Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                 </div>

                 {/* Top Right: Rating and Views */}
                 <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-end gap-1">
                    {dish.averageRating > 0 && (
                      <div className="bg-black/40 backdrop-blur-md px-1 py-0.5 rounded-sm text-[8px] md:text-[10px] font-bold border border-white/10 flex items-center gap-0.5 shadow-lg">
                        <Star className="w-2 h-2 md:w-2.5 md:h-2.5 text-yellow-500 fill-yellow-500" />
                        {dish.averageRating}
                      </div>
                    )}
                    <div className="bg-black/40 backdrop-blur-md px-1 py-0.5 rounded-sm text-[8px] md:text-[10px] font-medium border border-white/10 flex items-center gap-0.5 shadow-lg">
                       <PlaySquare className="w-2 h-2 md:w-2.5 md:h-2.5 text-white/70" />
                       {dish.viewCount > 1000 ? `${(dish.viewCount / 1000).toFixed(1)}k` : dish.viewCount}
                    </div>
                 </div>

                 {/* Bottom Left: Name and Price */}
                 <div className="absolute bottom-1.5 left-1.5 z-10 right-1.5">
                    <h3 className="font-bold text-[10px] md:text-xs text-white drop-shadow-md line-clamp-2 leading-tight mb-1">{dish.name}</h3>
                    <div className="flex">
                      <span className="font-bold text-[9px] md:text-[10px] text-white/90 drop-shadow-md bg-[#E11D48] px-1 py-0.5">
                        {dish.priceFormatted}
                      </span>
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
