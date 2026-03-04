// src/application/use-cases/update-dish.use-case.ts

import { UpdateDishInput, DishOutput } from "../dtos/dish.dto";
import { IDishRepository } from "@/domain/ports/dish-repository.port";
import { DishNotFoundError } from "@/domain/errors/domain-errors";
import { Dish } from "@/domain/entities/dish";
import { Price } from "@/domain/value-objects/price";

export class UpdateDishUseCase {
  constructor(private readonly dishRepo: IDishRepository) {}

  async execute(input: UpdateDishInput): Promise<DishOutput> {
    const existing = await this.dishRepo.findById(input.id);
    if (!existing) {
      throw new DishNotFoundError(input.id);
    }

    const updated = {
      ...existing,
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.priceInCents !== undefined && { price: input.priceInCents }),
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      ...(input.highlighted !== undefined && { highlighted: input.highlighted }),
      ...(input.videoUrl !== undefined && { videoUrl: input.videoUrl }),
      ...(input.thumbnailUrl !== undefined && { thumbnailUrl: input.thumbnailUrl }),
      updatedAt: new Date(),
    };

    // Validate through entity
    const dish = Dish.fromSnapshot(updated);
    const snapshot = dish.toSnapshot();
    await this.dishRepo.update(snapshot);

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
