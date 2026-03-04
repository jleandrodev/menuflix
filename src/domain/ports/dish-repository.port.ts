// src/domain/ports/dish-repository.port.ts

import { DishSnapshot } from "../entities/dish";

export interface IDishRepository {
  findByRestaurant(restaurantId: string, options?: {
    categoryId?: string;
    activeOnly?: boolean;
  }): Promise<DishSnapshot[]>;
  findById(id: string): Promise<DishSnapshot | null>;
  save(dish: DishSnapshot): Promise<void>;
  update(dish: DishSnapshot): Promise<void>;
  updateAverageRating(dishId: string, averageRating: number, ratingCount: number): Promise<void>;
  incrementViewCount(dishId: string): Promise<void>;
}
