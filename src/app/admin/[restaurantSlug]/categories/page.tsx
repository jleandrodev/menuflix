import { PrismaCategoryRepository } from "@/infrastructure/database/prisma-category-repository";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { CategoriesClientPage } from "@/components/admin/categories-client-page";

export default async function CategoriesPage({
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

  const categoryRepo = new PrismaCategoryRepository();
  const categories = await categoryRepo.findByRestaurant(restaurant.id);

  return (
    <CategoriesClientPage 
      categories={JSON.parse(JSON.stringify(categories))} 
      restaurantId={restaurant.id}
      restaurantSlug={restaurantSlug}
    />
  );
}
