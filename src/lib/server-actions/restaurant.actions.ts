"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { Restaurant } from "@/domain/entities/restaurant";

export async function createRestaurantAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "Nome e Slug são obrigatórios." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/admin/login");
  }

  const restaurantRepo = new PrismaRestaurantRepository();

  // Verifica se o slug já existe
  const existing = await restaurantRepo.findBySlug(slug);
  if (existing) {
    return { error: "Este slug já está sendo usado por outro restaurante." };
  }

  try {
    const newRestaurant = Restaurant.create({
      name,
      slug,
    });

    await restaurantRepo.createWithAdmin(newRestaurant.toSnapshot(), user.email);
    
    revalidatePath("/admin", "layout");
    redirect(`/admin/${newRestaurant.slug}/dashboard`);
  } catch (error: any) {
    return { error: error.message || "Erro ao criar restaurante." };
  }
}
