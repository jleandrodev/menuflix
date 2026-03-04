// src/lib/factories/dish-factory.ts

import { CreateDishUseCase } from "@/application/use-cases/create-dish.use-case";
import { UpdateDishUseCase } from "@/application/use-cases/update-dish.use-case";
import { ToggleDishUseCase } from "@/application/use-cases/toggle-dish.use-case";
import { GetMetricsUseCase } from "@/application/use-cases/get-metrics.use-case";
import { ManageCategoriesUseCase } from "@/application/use-cases/manage-categories.use-case";
import { PrismaDishRepository } from "@/infrastructure/database/prisma-dish-repository";
import { PrismaCategoryRepository } from "@/infrastructure/database/prisma-category-repository";

export function makeCreateDishUseCase(): CreateDishUseCase {
  return new CreateDishUseCase(new PrismaDishRepository());
}

export function makeUpdateDishUseCase(): UpdateDishUseCase {
  return new UpdateDishUseCase(new PrismaDishRepository());
}

export function makeToggleDishUseCase(): ToggleDishUseCase {
  return new ToggleDishUseCase(new PrismaDishRepository());
}

export function makeGetMetricsUseCase(): GetMetricsUseCase {
  return new GetMetricsUseCase(new PrismaDishRepository());
}

export function makeManageCategoriesUseCase(): ManageCategoriesUseCase {
  return new ManageCategoriesUseCase(new PrismaCategoryRepository());
}
