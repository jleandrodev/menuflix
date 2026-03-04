// src/infrastructure/database/prisma-restaurant-repository.ts

import { prisma } from "./prisma-client";
import { IRestaurantRepository } from "@/domain/ports/restaurant-repository.port";
import { RestaurantSnapshot } from "@/domain/entities/restaurant";

export class PrismaRestaurantRepository implements IRestaurantRepository {
  async findBySlug(slug: string): Promise<RestaurantSnapshot | null> {
    const r = await prisma.restaurant.findUnique({ where: { slug } });
    if (!r) return null;
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      logo: r.logo,
      plan: r.plan,
      isActive: r.isActive,
      config: r.config as Record<string, unknown>,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async findById(id: string): Promise<RestaurantSnapshot | null> {
    const r = await prisma.restaurant.findUnique({ where: { id } });
    if (!r) return null;
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      logo: r.logo,
      plan: r.plan,
      isActive: r.isActive,
      config: r.config as Record<string, unknown>,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async findByAdminEmail(email: string): Promise<RestaurantSnapshot[]> {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        admins: {
          some: {
            email
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return restaurants.map((r: any) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      logo: r.logo,
      plan: r.plan,
      isActive: r.isActive,
      config: r.config as Record<string, unknown>,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async save(restaurant: RestaurantSnapshot): Promise<void> {
    await prisma.restaurant.create({
      data: {
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        logo: restaurant.logo,
        plan: restaurant.plan,
        isActive: restaurant.isActive,
        config: restaurant.config as any,
      },
    });
  }

  async createWithAdmin(restaurant: RestaurantSnapshot, adminEmail: string): Promise<void> {
    await prisma.restaurant.create({
      data: {
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        logo: restaurant.logo,
        plan: restaurant.plan,
        isActive: restaurant.isActive,
        config: restaurant.config as any,
        admins: {
          connectOrCreate: {
            where: { email: adminEmail },
            create: {
              email: adminEmail,
              name: adminEmail.split('@')[0], // Nome padrão baseado no email
              passwordHash: 'supabase-auth', // Placeholder
            }
          }
        }
      },
    });
  }

  async update(restaurant: RestaurantSnapshot): Promise<void> {
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: restaurant.name,
        logo: restaurant.logo,
        plan: restaurant.plan,
        isActive: restaurant.isActive,
        config: restaurant.config as any,
      },
    });
  }

  async listAdmins(restaurantId: string): Promise<{ id: string; email: string; name: string }[]> {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { admins: true },
    });

    if (!restaurant) return [];

    return restaurant.admins.map((admin: any) => ({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    }));
  }

  async addAdminByEmail(restaurantId: string, email: string): Promise<void> {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        admins: {
          connectOrCreate: {
            where: { email },
            create: {
              email,
              name: email.split("@")[0],
              passwordHash: "supabase-auth", // Placeholder
            },
          },
        },
      },
    });
  }

  async removeAdmin(restaurantId: string, adminId: string): Promise<void> {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        admins: {
          disconnect: { id: adminId },
        },
      },
    });
  }
}
