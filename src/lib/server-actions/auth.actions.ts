"use server";
// src/lib/server-actions/auth.actions.ts

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent("Login ou senha inválidos. Tente novamente.")}`);
  }

  // Busca os restaurantes do usuário para redirecionar para o primeiro
  const restaurantRepo = new PrismaRestaurantRepository();
  const userRestaurants = await restaurantRepo.findByAdminEmail(email);

  // Limpa o cache após trocar sessão e redireciona
  revalidatePath("/", "layout");

  if (userRestaurants.length > 0) {
    redirect(`/admin/${userRestaurants[0].slug}/dashboard`);
  } else {
    // Caso o admin não tenha restaurantes vinculados ainda
    redirect("/admin");
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/login");
}
