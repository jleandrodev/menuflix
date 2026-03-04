// src/application/use-cases/rate-dish.use-case.ts

import { RateDishInput, RatingOutput } from "../dtos/rating.dto";
import { IDishRepository } from "@/domain/ports/dish-repository.port";
import { IRatingRepository } from "@/domain/ports/rating-repository.port";
import { DishNotFoundError } from "@/domain/errors/domain-errors";
import { Rating } from "@/domain/entities/rating";

export class RateDishUseCase {
  constructor(
    private readonly dishRepo: IDishRepository,
    private readonly ratingRepo: IRatingRepository
  ) {}

  async execute(input: RateDishInput): Promise<RatingOutput> {
    const dish = await this.dishRepo.findById(input.dishId);
    if (!dish) {
      throw new DishNotFoundError(input.dishId);
    }

    const rating = Rating.create({
      dishId: input.dishId,
      score: input.score,
      sessionId: input.sessionId,
    });

    const snapshot = rating.toSnapshot();
    await this.ratingRepo.save(snapshot);

    // Recalculate average
    const { average, count } = await this.ratingRepo.getAverageByDish(input.dishId);
    await this.dishRepo.updateAverageRating(input.dishId, average, count);

    return {
      id: snapshot.id,
      dishId: snapshot.dishId,
      score: snapshot.score,
      createdAt: snapshot.createdAt,
    };
  }
}
