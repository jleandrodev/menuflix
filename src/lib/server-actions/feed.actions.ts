"use server";
// src/lib/server-actions/feed.actions.ts

import { PrismaDishRepository } from "@/infrastructure/database/prisma-dish-repository";

export async function incrementViewAction(dishId: string) {
  const repo = new PrismaDishRepository();
  await repo.incrementViewCount(dishId);
}
