"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Store, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Restaurant = { id: string; name: string; slug: string };

interface RestaurantSwitcherProps {
  restaurants: Restaurant[];
  currentSlug: string;
}

export function RestaurantSwitcher({ restaurants, currentSlug }: RestaurantSwitcherProps) {
  const router = useRouter();
  
  const selectedRestaurant = restaurants.find(r => r.slug === currentSlug) || restaurants[0];

  const handleSelect = (slug: string) => {
    router.push(`/admin/${slug}/dashboard`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-950/50 px-3 py-2 text-sm font-medium hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500/50"
          )}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-500 border border-red-500/20">
              <Store className="h-4 w-4" />
            </div>
            <span className="truncate text-zinc-200">{selectedRestaurant?.name || "Selecione..."}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[224px] border-white/10 bg-zinc-950 text-zinc-300 shadow-xl" 
        align="start"
      >
        <DropdownMenuLabel className="text-xs text-zinc-500 font-medium px-2 py-1.5">
          Seus Restaurantes
        </DropdownMenuLabel>
        {restaurants.map((restaurant) => (
          <DropdownMenuItem
            key={restaurant.id}
            onClick={() => handleSelect(restaurant.slug)}
            className="flex items-center gap-2 cursor-pointer focus:bg-white/10 focus:text-white py-2"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5">
              <Store className="h-3 w-3" />
            </div>
            <span className="truncate flex-1 font-medium">{restaurant.name}</span>
            {currentSlug === restaurant.slug && (
              <Check className="h-4 w-4 text-red-500 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-white/10" />
        <Link href="/admin/new" className="block w-full">
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-zinc-400 focus:bg-white/10 focus:text-white py-2">
            <PlusCircle className="h-4 w-4" />
            <span>Criar restaurante</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
