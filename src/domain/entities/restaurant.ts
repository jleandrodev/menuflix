// src/domain/entities/restaurant.ts

import { Slug } from "../value-objects/slug";

export interface RestaurantProps {
  id: string;
  slug: Slug;
  name: string;
  logo: string | null;
  plan: string;
  isActive: boolean;
  config: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRestaurantInput {
  id?: string;
  slug: string;
  name: string;
  logo?: string | null;
  plan?: string;
}

export interface RestaurantSnapshot {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  plan: string;
  isActive: boolean;
  config: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Restaurant {
  private constructor(private readonly props: RestaurantProps) {}

  static create(input: CreateRestaurantInput): Restaurant {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error("Restaurant name is required.");
    }

    const now = new Date();
    return new Restaurant({
      id: input.id ?? crypto.randomUUID(),
      slug: Slug.create(input.slug),
      name: input.name.trim(),
      logo: input.logo ?? null,
      plan: input.plan ?? "basic",
      isActive: true,
      config: {},
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromSnapshot(snapshot: RestaurantSnapshot): Restaurant {
    return new Restaurant({
      ...snapshot,
      slug: Slug.create(snapshot.slug),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get slug(): string {
    return this.props.slug.toString();
  }

  get name(): string {
    return this.props.name;
  }

  get logo(): string | null {
    return this.props.logo;
  }

  get plan(): string {
    return this.props.plan;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  deactivate(): Restaurant {
    return new Restaurant({ ...this.props, isActive: false, updatedAt: new Date() });
  }

  activate(): Restaurant {
    return new Restaurant({ ...this.props, isActive: true, updatedAt: new Date() });
  }

  toSnapshot(): RestaurantSnapshot {
    return {
      id: this.props.id,
      slug: this.props.slug.toString(),
      name: this.props.name,
      logo: this.props.logo,
      plan: this.props.plan,
      isActive: this.props.isActive,
      config: this.props.config,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
