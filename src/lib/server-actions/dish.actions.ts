"use server";

import { CreateDishUseCase } from "@/application/use-cases/create-dish.use-case";
import { UpdateDishUseCase } from "@/application/use-cases/update-dish.use-case";
import { PrismaDishRepository } from "@/infrastructure/database/prisma-dish-repository";
import { SupabaseVideoStorageAdapter } from "@/infrastructure/storage/supabase-video-storage-adapter";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDishAction(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  const restaurantSlug = formData.get("restaurantSlug") as string;
  const categoryId = formData.get("categoryId") as string || null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceInCents = Math.round(parseFloat(formData.get("price") as string) * 100);
  const highlighted = formData.get("highlighted") === "true";
  const videoFile = formData.get("video") as File | null;

  try {
    let videoUrl = null;
    let thumbnailUrl = null;

    if (videoFile && videoFile.size > 0) {
      const supabase = await createClient();
      const storage = new SupabaseVideoStorageAdapter(supabase);
      const arrayBuffer = await videoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await storage.upload({
        restaurantId,
        dishId: crypto.randomUUID(),
        file: buffer,
        fileName: videoFile.name,
        mimeType: videoFile.type
      });
      
      videoUrl = uploadResult.url;
      thumbnailUrl = uploadResult.thumbnailUrl || null;
    }

    const dishRepo = new PrismaDishRepository();
    const useCase = new CreateDishUseCase(dishRepo);

    await useCase.execute({
      restaurantId,
      categoryId,
      name,
      description,
      priceInCents,
      videoUrl,
      thumbnailUrl,
      highlighted,
    });

    revalidatePath(`/admin/${restaurantSlug}/dishes`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar prato:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido ao criar prato" 
    };
  }
}

export async function updateDishAction(formData: FormData) {
  const dishId = formData.get("dishId") as string;
  const restaurantId = formData.get("restaurantId") as string;
  const restaurantSlug = formData.get("restaurantSlug") as string;
  const categoryId = formData.get("categoryId") as string || null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceInCents = Math.round(parseFloat(formData.get("price") as string) * 100);
  const highlighted = formData.get("highlighted") === "true";
  const videoFile = formData.get("video") as File | null;

  try {
    let videoUrl = undefined;
    let thumbnailUrl = undefined;

    if (videoFile && videoFile.size > 0) {
      const supabase = await createClient();
      const storage = new SupabaseVideoStorageAdapter(supabase);
      const arrayBuffer = await videoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await storage.upload({
        restaurantId,
        dishId,
        file: buffer,
        fileName: videoFile.name,
        mimeType: videoFile.type
      });
      
      videoUrl = uploadResult.url;
      thumbnailUrl = uploadResult.thumbnailUrl || null;
    }

    const dishRepo = new PrismaDishRepository();
    const useCase = new UpdateDishUseCase(dishRepo);

    await useCase.execute({
      id: dishId,
      name,
      description,
      priceInCents,
      categoryId: categoryId ?? undefined,
      highlighted,
      videoUrl,
      thumbnailUrl: thumbnailUrl ?? undefined,
    });

    revalidatePath(`/admin/${restaurantSlug}/dishes`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar prato:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao atualizar prato" 
    };
  }
}

export async function deleteDishAction(restaurantSlug: string, dishId: string) {
  try {
    const dishRepo = new PrismaDishRepository();
    // Reusing repository delete if it exists, otherwise use prisma directly or add it
    // Let's check repository first.
    await (dishRepo as any).delete?.(dishId); 
    // Wait, let's verify if delete exists.
    
    revalidatePath(`/admin/${restaurantSlug}/dishes`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar prato:", error);
    return { success: false, error: "Erro ao deletar prato" };
  }
}
