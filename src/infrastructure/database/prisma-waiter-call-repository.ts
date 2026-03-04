// src/infrastructure/database/prisma-waiter-call-repository.ts

import { prisma } from "./prisma-client";
import { IWaiterCallRepository } from "@/domain/ports/waiter-call-repository.port";
import { WaiterCallSnapshot } from "@/domain/entities/waiter-call";
import { WaiterCallStatus } from "@/domain/entities/waiter-call";

export class PrismaWaiterCallRepository implements IWaiterCallRepository {
  async save(call: WaiterCallSnapshot): Promise<void> {
    await prisma.waiterCall.create({
      data: {
        id: call.id,
        restaurantId: call.restaurantId,
        tableIdentifier: call.tableIdentifier,
        status: call.status,
      },
    });
  }

  async findByRestaurant(
    restaurantId: string,
    options?: { status?: string }
  ): Promise<WaiterCallSnapshot[]> {
    const where: Record<string, unknown> = { restaurantId };
    if (options?.status) where.status = options.status;

    const calls = await prisma.waiterCall.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return calls.map((c) => ({
      id: c.id,
      restaurantId: c.restaurantId,
      tableIdentifier: c.tableIdentifier,
      status: c.status as WaiterCallStatus,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await prisma.waiterCall.update({
      where: { id },
      data: { status },
    });
  }
}
