// src/app/(public)/[slug]/page.tsx
// Server Component that loads feed data and renders VideoFeed

import { makeFeedUseCase } from "@/lib/factories/feed-factory";
import { VideoFeed } from "@/components/video-feed";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FeedPage({ params }: Props) {
  const { slug } = await params;

  try {
    const feedUseCase = makeFeedUseCase();
    const feed = await feedUseCase.execute({ slug });

    return (
      <main className="min-h-screen bg-black">
        <VideoFeed
          dishes={feed.dishes}
          categories={feed.categories}
          restaurantSlug={feed.restaurant.slug}
          restaurantName={feed.restaurant.name}
        />
      </main>
    );
  } catch {
    notFound();
  }
}
