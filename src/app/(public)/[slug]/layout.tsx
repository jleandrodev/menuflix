// src/app/(public)/[slug]/layout.tsx
// Public route layout with dynamic metadata

import type { Metadata } from "next";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repo = new PrismaRestaurantRepository();
  const restaurant = await repo.findBySlug(slug);

  if (!restaurant || !restaurant.isActive) {
    return { title: "Restaurante não encontrado" };
  }

  return {
    title: `${restaurant.name} — VideoMenu`,
    description: `Confira o cardápio em vídeo de ${restaurant.name}. Assista aos pratos e escolha sua refeição!`,
    openGraph: {
      title: `${restaurant.name} — VideoMenu`,
      description: `Cardápio em vídeo de ${restaurant.name}`,
      type: "website",
    },
  };
}

export default async function PublicLayout({ params, children }: Props) {
  const { slug } = await params;
  const repo = new PrismaRestaurantRepository();
  const restaurant = await repo.findBySlug(slug);

  if (!restaurant || !restaurant.isActive) {
    notFound();
  }

  return <>{children}</>;
}
