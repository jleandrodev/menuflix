"use server";

import { ManageCategoriesUseCase } from "@/application/use-cases/manage-categories.use-case";
import { PrismaCategoryRepository } from "@/infrastructure/database/prisma-category-repository";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(restaurantId: string, restaurantSlug: string, name: string) {
  try {
    const repo = new PrismaCategoryRepository();
    const useCase = new ManageCategoriesUseCase(repo);

    await useCase.create({ restaurantId, name });

    revalidatePath(`/admin/${restaurantSlug}/categories`);
    revalidatePath(`/admin/${restaurantSlug}/dishes`); // Dishes page needs categories for the modal
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao criar categoria" 
    };
  }
}

export async function updateCategoryAction(restaurantSlug: string, id: string, name: string) {
  try {
    const repo = new PrismaCategoryRepository();
    const useCase = new ManageCategoriesUseCase(repo);

    await useCase.update({ id, name });

    revalidatePath(`/admin/${restaurantSlug}/categories`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao atualizar categoria" 
    };
  }
}

export async function deleteCategoryAction(restaurantSlug: string, id: string) {
  try {
    const repo = new PrismaCategoryRepository();
    const useCase = new ManageCategoriesUseCase(repo);

    await useCase.delete(id);

    revalidatePath(`/admin/${restaurantSlug}/categories`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao deletar categoria" 
    };
  }
}

export async function reorderCategoriesAction(restaurantId: string, restaurantSlug: string, orderedIds: string[]) {
  try {
    const repo = new PrismaCategoryRepository();
    const useCase = new ManageCategoriesUseCase(repo);

    await useCase.reorder(restaurantId, orderedIds);

    revalidatePath(`/admin/${restaurantSlug}/categories`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao reordenar categorias:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao reordenar categorias" 
    };
  }
}
