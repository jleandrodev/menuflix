// src/lib/factories/feed-factory.ts

import { GetFeedUseCase } from "@/application/use-cases/get-feed.use-case";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { PrismaDishRepository } from "@/infrastructure/database/prisma-dish-repository";
import { PrismaCategoryRepository } from "@/infrastructure/database/prisma-category-repository";

export function makeFeedUseCase(): GetFeedUseCase {
  return new GetFeedUseCase(
    new PrismaRestaurantRepository(),
    new PrismaDishRepository(),
    new PrismaCategoryRepository()
  );
}
