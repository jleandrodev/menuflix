// src/domain/ports/rating-repository.port.ts

import { RatingSnapshot } from "../entities/rating";

export interface IRatingRepository {
  save(rating: RatingSnapshot): Promise<void>;
  findByDish(dishId: string): Promise<RatingSnapshot[]>;
  getAverageByDish(dishId: string): Promise<{ average: number; count: number }>;
}
