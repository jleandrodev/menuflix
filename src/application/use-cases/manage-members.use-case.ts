// src/application/use-cases/manage-members.use-case.ts

import { IRestaurantRepository } from "@/domain/ports/restaurant-repository.port";

export interface MemberOutput {
  id: string;
  email: string;
  name: string;
}

export class ManageMembersUseCase {
  constructor(private readonly restaurantRepo: IRestaurantRepository) {}

  async listMembers(restaurantSlug: string): Promise<MemberOutput[]> {
    const restaurant = await this.restaurantRepo.findBySlug(restaurantSlug);
    if (!restaurant) throw new Error("Restaurant not found.");
    
    return this.restaurantRepo.listAdmins(restaurant.id);
  }

  async addMember(restaurantSlug: string, email: string): Promise<void> {
    const restaurant = await this.restaurantRepo.findBySlug(restaurantSlug);
    if (!restaurant) throw new Error("Restaurant not found.");

    await this.restaurantRepo.addAdminByEmail(restaurant.id, email.toLowerCase().trim());
  }

  async removeMember(restaurantSlug: string, adminId: string): Promise<void> {
    const restaurant = await this.restaurantRepo.findBySlug(restaurantSlug);
    if (!restaurant) throw new Error("Restaurant not found.");

    await this.restaurantRepo.removeAdmin(restaurant.id, adminId);
  }
}
