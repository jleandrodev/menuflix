// src/domain/ports/category-repository.port.ts

import { CategorySnapshot } from "../entities/category";

export interface ICategoryRepository {
  findByRestaurant(restaurantId: string): Promise<CategorySnapshot[]>;
  findById(id: string): Promise<CategorySnapshot | null>;
  save(category: CategorySnapshot): Promise<void>;
  update(category: CategorySnapshot): Promise<void>;
  delete(id: string): Promise<void>;
  reorder(restaurantId: string, orderedIds: string[]): Promise<void>;
}
