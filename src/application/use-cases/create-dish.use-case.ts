// src/application/use-cases/create-dish.use-case.ts

import { CreateDishInput, DishOutput } from "../dtos/dish.dto";
import { IDishRepository } from "@/domain/ports/dish-repository.port";
import { Dish } from "@/domain/entities/dish";
import { Price } from "@/domain/value-objects/price";

export class CreateDishUseCase {
  constructor(private readonly dishRepo: IDishRepository) {}

  async execute(input: CreateDishInput): Promise<DishOutput> {
    const dish = Dish.create({
      restaurantId: input.restaurantId,
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      priceInCents: input.priceInCents,
      videoUrl: input.videoUrl,
      thumbnailUrl: input.thumbnailUrl,
      highlighted: input.highlighted,
    });

    const snapshot = dish.toSnapshot();
    await this.dishRepo.save(snapshot);

    return {
      id: snapshot.id,
      restaurantId: snapshot.restaurantId,
      categoryId: snapshot.categoryId,
      name: snapshot.name,
      description: snapshot.description,
      priceInCents: snapshot.price,
      priceFormatted: Price.create(snapshot.price).format(),
      videoUrl: snapshot.videoUrl,
      thumbnailUrl: snapshot.thumbnailUrl,
      highlighted: snapshot.highlighted,
      active: snapshot.active,
      viewCount: snapshot.viewCount,
      averageRating: snapshot.averageRating,
      ratingCount: snapshot.ratingCount,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    };
  }
}
