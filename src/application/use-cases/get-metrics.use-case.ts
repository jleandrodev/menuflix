// src/application/use-cases/get-metrics.use-case.ts

import { MetricsInput, MetricsOutput } from "../dtos/metrics.dto";
import { IDishRepository } from "@/domain/ports/dish-repository.port";

export class GetMetricsUseCase {
  constructor(private readonly dishRepo: IDishRepository) {}

  async execute(input: MetricsInput): Promise<MetricsOutput> {
    const dishes = await this.dishRepo.findByRestaurant(input.restaurantId);

    const totalViews = dishes.reduce((sum, d) => sum + d.viewCount, 0);
    const activeDishes = dishes.filter((d) => d.active);
    const ratedDishes = dishes.filter((d) => d.ratingCount > 0);
    const overallRating =
      ratedDishes.length > 0
        ? ratedDishes.reduce((sum, d) => sum + d.averageRating * d.ratingCount, 0) /
          ratedDishes.reduce((sum, d) => sum + d.ratingCount, 0)
        : 0;

    const dishRanking = [...dishes]
      .sort((a, b) => b.viewCount - a.viewCount)
      .map((d) => ({
        id: d.id,
        name: d.name,
        viewCount: d.viewCount,
        averageRating: d.averageRating,
        ratingCount: d.ratingCount,
      }));

    return {
      totalViews,
      totalDishes: dishes.length,
      activeDishes: activeDishes.length,
      averageRating: Math.round(overallRating * 10) / 10,
      dishRanking,
    };
  }
}
