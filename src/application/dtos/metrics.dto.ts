// src/application/dtos/metrics.dto.ts

export interface MetricsInput {
  restaurantId: string;
}

export interface DishMetric {
  id: string;
  name: string;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
}

export interface MetricsOutput {
  totalViews: number;
  totalDishes: number;
  activeDishes: number;
  averageRating: number;
  dishRanking: DishMetric[];
}
