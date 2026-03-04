// src/infrastructure/database/prisma-dish-repository.ts

import { prisma } from "./prisma-client";
import { IDishRepository } from "@/domain/ports/dish-repository.port";
import { DishSnapshot } from "@/domain/entities/dish";

export class PrismaDishRepository implements IDishRepository {
  async findByRestaurant(
    restaurantId: string,
    options?: { categoryId?: string; activeOnly?: boolean }
  ): Promise<DishSnapshot[]> {
    const where: Record<string, unknown> = { restaurantId };
    if (options?.categoryId) where.categoryId = options.categoryId;
    if (options?.activeOnly) where.active = true;

    const dishes = await prisma.dish.findMany({
      where,
      orderBy: [{ highlighted: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return dishes.map((d: any) => ({
      id: d.id,
      restaurantId: d.restaurantId,
      categoryId: d.categoryId,
      name: d.name,
      description: d.description,
      price: d.price,
      videoUrl: d.videoUrl,
      thumbnailUrl: d.thumbnailUrl,
      highlighted: d.highlighted,
      active: d.active,
      viewCount: d.viewCount,
      averageRating: d.averageRating,
      ratingCount: d.ratingCount,
      displayOrder: d.displayOrder,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
  }

  async findById(id: string): Promise<DishSnapshot | null> {
    const d = await prisma.dish.findUnique({ where: { id } });
    if (!d) return null;
    return {
      id: d.id,
      restaurantId: d.restaurantId,
      categoryId: d.categoryId,
      name: d.name,
      description: d.description,
      price: d.price,
      videoUrl: d.videoUrl,
      thumbnailUrl: d.thumbnailUrl,
      highlighted: d.highlighted,
      active: d.active,
      viewCount: d.viewCount,
      averageRating: d.averageRating,
      ratingCount: d.ratingCount,
      displayOrder: d.displayOrder,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  }

  async save(dish: DishSnapshot): Promise<void> {
    await prisma.dish.create({
      data: {
        id: dish.id,
        restaurantId: dish.restaurantId,
        categoryId: dish.categoryId,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        videoUrl: dish.videoUrl,
        thumbnailUrl: dish.thumbnailUrl,
        highlighted: dish.highlighted,
        active: dish.active,
        viewCount: dish.viewCount,
        averageRating: dish.averageRating,
        ratingCount: dish.ratingCount,
        displayOrder: dish.displayOrder,
      },
    });
  }

  async update(dish: DishSnapshot): Promise<void> {
    await prisma.dish.update({
      where: { id: dish.id },
      data: {
        categoryId: dish.categoryId,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        videoUrl: dish.videoUrl,
        thumbnailUrl: dish.thumbnailUrl,
        highlighted: dish.highlighted,
        active: dish.active,
        displayOrder: dish.displayOrder,
      },
    });
  }

  async updateAverageRating(
    dishId: string,
    averageRating: number,
    ratingCount: number
  ): Promise<void> {
    await prisma.dish.update({
      where: { id: dishId },
      data: { averageRating, ratingCount },
    });
  }

  async incrementViewCount(dishId: string): Promise<void> {
    await prisma.dish.update({
      where: { id: dishId },
      data: { viewCount: { increment: 1 } },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.dish.delete({ where: { id } });
  }
}
