import { PrismaDishRepository } from "@/infrastructure/database/prisma-dish-repository";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { PrismaCategoryRepository } from "@/infrastructure/database/prisma-category-repository";
import { DishesClientPage } from "@/components/admin/dishes-client-page";

export default async function DishesPage({ 
  params 
}: { 
  params: Promise<{ restaurantSlug: string }> 
}) {
  const { restaurantSlug } = await params;
  const restaurantRepo = new PrismaRestaurantRepository();
  const restaurant = await restaurantRepo.findBySlug(restaurantSlug);
  
  if (!restaurant) {
    return <div>Restaurante não encontrado</div>;
  }

  const repo = new PrismaDishRepository();
  const categoryRepo = new PrismaCategoryRepository();
  
  const [dishes, categories] = await Promise.all([
    repo.findByRestaurant(restaurant.id),
    categoryRepo.findByRestaurant(restaurant.id)
  ]);

  return (
    <DishesClientPage 
      dishes={JSON.parse(JSON.stringify(dishes))} 
      categories={JSON.parse(JSON.stringify(categories))}
      restaurantId={restaurant.id}
      restaurantSlug={restaurantSlug}
    />
  );
}
