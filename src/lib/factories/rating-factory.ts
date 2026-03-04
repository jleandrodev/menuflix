// src/lib/factories/rating-factory.ts

import { RateDishUseCase } from "@/application/use-cases/rate-dish.use-case";
import { PrismaDishRepository } from "@/infrastructure/database/prisma-dish-repository";
import { PrismaRatingRepository } from "@/infrastructure/database/prisma-rating-repository";

export function makeRateDishUseCase(): RateDishUseCase {
  return new RateDishUseCase(
    new PrismaDishRepository(),
    new PrismaRatingRepository()
  );
}
