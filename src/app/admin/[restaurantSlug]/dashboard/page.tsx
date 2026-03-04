import { makeGetMetricsUseCase } from "@/lib/factories/dish-factory";
import { MetricsDashboard } from "@/components/admin/metrics-dashboard";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { notFound } from "next/navigation";

export default async function DashboardPage({
  params
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  const restaurantRepo = new PrismaRestaurantRepository();
  const restaurant = await restaurantRepo.findBySlug(restaurantSlug);

  if (!restaurant) {
    notFound();
  }

  const useCase = makeGetMetricsUseCase();
  const metrics = await useCase.execute({ restaurantId: restaurant.id });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Visão Geral</h1>
        <p className="text-zinc-400">
          Acompanhe o desempenho do seu cardápio em vídeo para {restaurant.name}.
        </p>
      </div>

      <MetricsDashboard metrics={metrics} />
    </div>
  );
}
