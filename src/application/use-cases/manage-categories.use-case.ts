// src/application/use-cases/manage-categories.use-case.ts

import { ICategoryRepository } from "@/domain/ports/category-repository.port";
import { CategoryNotFoundError } from "@/domain/errors/domain-errors";
import { Category, CategorySnapshot } from "@/domain/entities/category";

export interface CreateCategoryInput {
  restaurantId: string;
  name: string;
  displayOrder?: number;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
}

export class ManageCategoriesUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async create(input: CreateCategoryInput): Promise<CategorySnapshot> {
    const category = Category.create({
      restaurantId: input.restaurantId,
      name: input.name,
      displayOrder: input.displayOrder,
    });
    const snapshot = category.toSnapshot();
    await this.categoryRepo.save(snapshot);
    return snapshot;
  }

  async update(input: UpdateCategoryInput): Promise<CategorySnapshot> {
    const existing = await this.categoryRepo.findById(input.id);
    if (!existing) {
      throw new CategoryNotFoundError(input.id);
    }

    let category = Category.fromSnapshot(existing);
    if (input.name) {
      category = category.rename(input.name);
    }

    const snapshot = category.toSnapshot();
    await this.categoryRepo.update(snapshot);
    return snapshot;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) {
      throw new CategoryNotFoundError(id);
    }
    await this.categoryRepo.delete(id);
  }

  async reorder(restaurantId: string, orderedIds: string[]): Promise<void> {
    await this.categoryRepo.reorder(restaurantId, orderedIds);
  }

  async list(restaurantId: string): Promise<CategorySnapshot[]> {
    return this.categoryRepo.findByRestaurant(restaurantId);
  }
}
