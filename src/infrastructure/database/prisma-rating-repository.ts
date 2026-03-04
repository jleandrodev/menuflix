// src/infrastructure/database/prisma-rating-repository.ts

import { prisma } from "./prisma-client";
import { IRatingRepository } from "@/domain/ports/rating-repository.port";
import { RatingSnapshot } from "@/domain/entities/rating";

export class PrismaRatingRepository implements IRatingRepository {
  async save(rating: RatingSnapshot): Promise<void> {
    await prisma.rating.create({
      data: {
        id: rating.id,
        dishId: rating.dishId,
        score: rating.score,
        sessionId: rating.sessionId,
      },
    });
  }

  async findByDish(dishId: string): Promise<RatingSnapshot[]> {
    const ratings = await prisma.rating.findMany({
      where: { dishId },
      orderBy: { createdAt: "desc" },
    });
    return ratings.map((r) => ({
      id: r.id,
      dishId: r.dishId,
      score: r.score,
      sessionId: r.sessionId,
      createdAt: r.createdAt,
    }));
  }

  async getAverageByDish(dishId: string): Promise<{ average: number; count: number }> {
    const result = await prisma.rating.aggregate({
      where: { dishId },
      _avg: { score: true },
      _count: { score: true },
    });
    return {
      average: result._avg.score ?? 0,
      count: result._count.score,
    };
  }
}
