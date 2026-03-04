// src/application/use-cases/call-waiter.use-case.ts

import { IWaiterCallRepository } from "@/domain/ports/waiter-call-repository.port";
import { INotificationService } from "@/domain/ports/notification-service.port";
import { IRestaurantRepository } from "@/domain/ports/restaurant-repository.port";
import { RestaurantNotFoundError } from "@/domain/errors/domain-errors";
import { WaiterCall } from "@/domain/entities/waiter-call";

export interface CallWaiterInput {
  slug: string;
  tableIdentifier: string;
}

export class CallWaiterUseCase {
  constructor(
    private readonly restaurantRepo: IRestaurantRepository,
    private readonly waiterCallRepo: IWaiterCallRepository,
    private readonly notificationService: INotificationService
  ) {}

  async execute(input: CallWaiterInput): Promise<{ id: string }> {
    const restaurant = await this.restaurantRepo.findBySlug(input.slug);
    if (!restaurant) {
      throw new RestaurantNotFoundError(input.slug);
    }

    const call = WaiterCall.create({
      restaurantId: restaurant.id,
      tableIdentifier: input.tableIdentifier,
    });

    const snapshot = call.toSnapshot();
    await this.waiterCallRepo.save(snapshot);

    await this.notificationService.notifyWaiterCall({
      restaurantId: restaurant.id,
      tableIdentifier: input.tableIdentifier,
      callId: snapshot.id,
    });

    return { id: snapshot.id };
  }
}
