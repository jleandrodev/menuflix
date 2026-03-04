// src/domain/ports/waiter-call-repository.port.ts

import { WaiterCallSnapshot } from "../entities/waiter-call";

export interface IWaiterCallRepository {
  save(call: WaiterCallSnapshot): Promise<void>;
  findByRestaurant(restaurantId: string, options?: {
    status?: string;
  }): Promise<WaiterCallSnapshot[]>;
  updateStatus(id: string, status: string): Promise<void>;
}
