// src/application/dtos/dish.dto.ts

export interface CreateDishInput {
  restaurantId: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  priceInCents: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  highlighted?: boolean;
}

export interface UpdateDishInput {
  id: string;
  name?: string;
  description?: string;
  priceInCents?: number;
  categoryId?: string | null;
  highlighted?: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface DishOutput {
  id: string;
  restaurantId: string;
  categoryId: string | null;
  name: string;
  description: string;
  priceInCents: number;
  priceFormatted: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  highlighted: boolean;
  active: boolean;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}
