// src/application/dtos/feed.dto.ts

export interface FeedInput {
  slug: string;
  categoryId?: string;
}

export interface FeedDishOutput {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  priceFormatted: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  highlighted: boolean;
  averageRating: number;
  ratingCount: number;
  categoryId: string | null;
  categoryName: string | null;
}

export interface FeedCategoryOutput {
  id: string;
  name: string;
  displayOrder: number;
}

export interface FeedOutput {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  dishes: FeedDishOutput[];
  categories: FeedCategoryOutput[];
}
