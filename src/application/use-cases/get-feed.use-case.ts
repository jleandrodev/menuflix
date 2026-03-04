// src/application/use-cases/get-feed.use-case.ts

import { FeedInput, FeedOutput, FeedDishOutput } from "../dtos/feed.dto";
import { IDishRepository } from "@/domain/ports/dish-repository.port";
import { IRestaurantRepository } from "@/domain/ports/restaurant-repository.port";
import { ICategoryRepository } from "@/domain/ports/category-repository.port";
import { RestaurantNotFoundError } from "@/domain/errors/domain-errors";
import { Price } from "@/domain/value-objects/price";

export class GetFeedUseCase {
  constructor(
    private readonly restaurantRepo: IRestaurantRepository,
    private readonly dishRepo: IDishRepository,
    private readonly categoryRepo: ICategoryRepository
  ) {}

  async execute(input: FeedInput): Promise<FeedOutput> {
    const restaurant = await this.restaurantRepo.findBySlug(input.slug);
    if (!restaurant || !restaurant.isActive) {
      throw new RestaurantNotFoundError(input.slug);
    }

    const [dishes, categories] = await Promise.all([
      this.dishRepo.findByRestaurant(restaurant.id, {
        categoryId: input.categoryId,
        activeOnly: true,
      }),
      this.categoryRepo.findByRestaurant(restaurant.id),
    ]);

    // Build category lookup
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    // Sort: highlighted first, then by displayOrder
    const sortedDishes = [...dishes].sort((a, b) => {
      if (a.highlighted !== b.highlighted) return a.highlighted ? -1 : 1;
      return a.displayOrder - b.displayOrder;
    });

    const feedDishes: FeedDishOutput[] = sortedDishes.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      priceInCents: d.price,
      priceFormatted: Price.create(d.price).format(),
      videoUrl: d.videoUrl,
      thumbnailUrl: d.thumbnailUrl,
      highlighted: d.highlighted,
      averageRating: d.averageRating,
      ratingCount: d.ratingCount,
      categoryId: d.categoryId,
      categoryName: d.categoryId ? categoryMap.get(d.categoryId) ?? null : null,
    }));

    return {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        logo: restaurant.logo,
      },
      dishes: feedDishes,
      categories: categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((c) => ({
          id: c.id,
          name: c.name,
          displayOrder: c.displayOrder,
        })),
    };
  }
}
