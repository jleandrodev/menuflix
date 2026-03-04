// src/lib/factories/waiter-factory.ts

import { CallWaiterUseCase } from "@/application/use-cases/call-waiter.use-case";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { PrismaWaiterCallRepository } from "@/infrastructure/database/prisma-waiter-call-repository";
import { ConsoleNotificationAdapter } from "@/infrastructure/notifications/waiter-notification-adapter";

export function makeCallWaiterUseCase(): CallWaiterUseCase {
  return new CallWaiterUseCase(
    new PrismaRestaurantRepository(),
    new PrismaWaiterCallRepository(),
    new ConsoleNotificationAdapter()
  );
}
