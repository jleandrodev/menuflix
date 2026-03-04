"use server";
// src/lib/server-actions/waiter.actions.ts

import { makeCallWaiterUseCase } from "@/lib/factories/waiter-factory";
import { z } from "zod";

const callWaiterSchema = z.object({
  slug: z.string().min(1),
  tableIdentifier: z.string().min(1),
});

export async function callWaiterAction(input: {
  slug: string;
  tableIdentifier: string;
}) {
  const validated = callWaiterSchema.parse(input);
  const useCase = makeCallWaiterUseCase();
  const result = await useCase.execute(validated);
  return { success: true, callId: result.id };
}
