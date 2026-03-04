// src/application/use-cases/toggle-dish.use-case.ts

import { IDishRepository } from "@/domain/ports/dish-repository.port";
import { DishNotFoundError } from "@/domain/errors/domain-errors";
import { Dish } from "@/domain/entities/dish";

export class ToggleDishUseCase {
  constructor(private readonly dishRepo: IDishRepository) {}

  async execute(dishId: string): Promise<{ active: boolean }> {
    const existing = await this.dishRepo.findById(dishId);
    if (!existing) {
      throw new DishNotFoundError(dishId);
    }

    const dish = Dish.fromSnapshot(existing);
    const toggled = existing.active ? dish.deactivate() : dish.activate();
    const snapshot = toggled.toSnapshot();
    await this.dishRepo.update(snapshot);

    return { active: snapshot.active };
  }
}
