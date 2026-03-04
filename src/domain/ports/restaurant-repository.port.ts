// src/domain/ports/restaurant-repository.port.ts

import { RestaurantSnapshot } from "../entities/restaurant";

export interface IRestaurantRepository {
  findBySlug(slug: string): Promise<RestaurantSnapshot | null>;
  findById(id: string): Promise<RestaurantSnapshot | null>;
  findByAdminEmail(email: string): Promise<RestaurantSnapshot[]>;
  save(restaurant: RestaurantSnapshot): Promise<void>;
  createWithAdmin(restaurant: RestaurantSnapshot, adminEmail: string): Promise<void>;
  update(restaurant: RestaurantSnapshot): Promise<void>;
}
