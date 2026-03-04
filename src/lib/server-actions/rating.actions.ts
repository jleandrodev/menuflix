"use server";
// src/lib/server-actions/rating.actions.ts

import { makeRateDishUseCase } from "@/lib/factories/rating-factory";
import { z } from "zod";

const rateDishSchema = z.object({
  dishId: z.string().uuid(),
  score: z.number().int().min(1).max(5),
  sessionId: z.string().optional(),
});

export async function rateDishAction(input: {
  dishId: string;
  score: number;
  sessionId?: string;
}) {
  const validated = rateDishSchema.parse(input);
  const useCase = makeRateDishUseCase();
  const result = await useCase.execute(validated);
  return { success: true, rating: result };
}
