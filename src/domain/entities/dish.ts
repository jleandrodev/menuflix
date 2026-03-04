// src/domain/entities/dish.ts

import { Price } from "../value-objects/price";
import { DishStatus } from "../value-objects/dish-status";
import { AverageRating } from "../value-objects/average-rating";
import { InvalidDishPriceError } from "../errors/domain-errors";

export interface DishProps {
  id: string;
  restaurantId: string;
  categoryId: string | null;
  name: string;
  description: string;
  price: Price;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  highlighted: boolean;
  status: DishStatus;
  viewCount: number;
  averageRating: AverageRating;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDishInput {
  id?: string;
  restaurantId: string;
  categoryId?: string | null;
  name: string;
  description?: string;
  priceInCents: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  highlighted?: boolean;
}

export interface DishSnapshot {
  id: string;
  restaurantId: string;
  categoryId: string | null;
  name: string;
  description: string;
  price: number; // cents
  videoUrl: string | null;
  thumbnailUrl: string | null;
  highlighted: boolean;
  active: boolean;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Dish {
  private constructor(private readonly props: DishProps) {}

  static create(input: CreateDishInput): Dish {
    if (input.priceInCents < 0) {
      throw new InvalidDishPriceError();
    }

    if (!input.name || input.name.trim().length === 0) {
      throw new Error("Dish name is required.");
    }

    const now = new Date();
    return new Dish({
      id: input.id ?? crypto.randomUUID(),
      restaurantId: input.restaurantId,
      categoryId: input.categoryId ?? null,
      name: input.name.trim(),
      description: (input.description ?? "").trim(),
      price: Price.create(input.priceInCents),
      videoUrl: input.videoUrl ?? null,
      thumbnailUrl: input.thumbnailUrl ?? null,
      highlighted: input.highlighted ?? false,
      status: DishStatus.active(),
      viewCount: 0,
      averageRating: AverageRating.empty(),
      displayOrder: 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromSnapshot(snapshot: DishSnapshot): Dish {
    return new Dish({
      id: snapshot.id,
      restaurantId: snapshot.restaurantId,
      categoryId: snapshot.categoryId,
      name: snapshot.name,
      description: snapshot.description,
      price: Price.create(snapshot.price),
      videoUrl: snapshot.videoUrl,
      thumbnailUrl: snapshot.thumbnailUrl,
      highlighted: snapshot.highlighted,
      status: DishStatus.from(snapshot.active),
      viewCount: snapshot.viewCount,
      averageRating: AverageRating.create(
        snapshot.averageRating,
        snapshot.ratingCount
      ),
      displayOrder: snapshot.displayOrder,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    });
  }

  get id(): string { return this.props.id; }
  get restaurantId(): string { return this.props.restaurantId; }
  get categoryId(): string | null { return this.props.categoryId; }
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
  get price(): Price { return this.props.price; }
  get videoUrl(): string | null { return this.props.videoUrl; }
  get thumbnailUrl(): string | null { return this.props.thumbnailUrl; }
  get isHighlighted(): boolean { return this.props.highlighted; }
  get isActive(): boolean { return this.props.status.isActive(); }
  get viewCount(): number { return this.props.viewCount; }
  get rating(): AverageRating { return this.props.averageRating; }

  highlight(): Dish {
    return new Dish({ ...this.props, highlighted: true, updatedAt: new Date() });
  }

  removeHighlight(): Dish {
    return new Dish({ ...this.props, highlighted: false, updatedAt: new Date() });
  }

  deactivate(): Dish {
    return new Dish({ ...this.props, status: DishStatus.inactive(), updatedAt: new Date() });
  }

  activate(): Dish {
    return new Dish({ ...this.props, status: DishStatus.active(), updatedAt: new Date() });
  }

  incrementViewCount(): Dish {
    return new Dish({ ...this.props, viewCount: this.props.viewCount + 1 });
  }

  updateAverageRating(newScore: number): Dish {
    const newRating = AverageRating.recalculate(
      this.props.averageRating.value,
      this.props.averageRating.totalCount,
      newScore
    );
    return new Dish({ ...this.props, averageRating: newRating, updatedAt: new Date() });
  }

  toSnapshot(): DishSnapshot {
    return {
      id: this.props.id,
      restaurantId: this.props.restaurantId,
      categoryId: this.props.categoryId,
      name: this.props.name,
      description: this.props.description,
      price: this.props.price.cents,
      videoUrl: this.props.videoUrl,
      thumbnailUrl: this.props.thumbnailUrl,
      highlighted: this.props.highlighted,
      active: this.props.status.isActive(),
      viewCount: this.props.viewCount,
      averageRating: this.props.averageRating.value,
      ratingCount: this.props.averageRating.totalCount,
      displayOrder: this.props.displayOrder,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
