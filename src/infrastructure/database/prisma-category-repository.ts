// src/infrastructure/database/prisma-category-repository.ts

import { prisma } from "./prisma-client";
import { ICategoryRepository } from "@/domain/ports/category-repository.port";
import { CategorySnapshot } from "@/domain/entities/category";

export class PrismaCategoryRepository implements ICategoryRepository {
  async findByRestaurant(restaurantId: string): Promise<CategorySnapshot[]> {
    const categories = await prisma.category.findMany({
      where: { restaurantId },
      orderBy: { displayOrder: "asc" },
    });
    return categories.map((c) => ({
      id: c.id,
      restaurantId: c.restaurantId,
      name: c.name,
      displayOrder: c.displayOrder,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  async findById(id: string): Promise<CategorySnapshot | null> {
    const c = await prisma.category.findUnique({ where: { id } });
    if (!c) return null;
    return {
      id: c.id,
      restaurantId: c.restaurantId,
      name: c.name,
      displayOrder: c.displayOrder,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  async save(category: CategorySnapshot): Promise<void> {
    await prisma.category.create({
      data: {
        id: category.id,
        restaurantId: category.restaurantId,
        name: category.name,
        displayOrder: category.displayOrder,
      },
    });
  }

  async update(category: CategorySnapshot): Promise<void> {
    await prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        displayOrder: category.displayOrder,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async reorder(restaurantId: string, orderedIds: string[]): Promise<void> {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );
  }
}
