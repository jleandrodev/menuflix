// src/domain/entities/category.ts

export interface CategoryProps {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  id?: string;
  restaurantId: string;
  name: string;
  displayOrder?: number;
}

export interface CategorySnapshot {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Category {
  private constructor(private readonly props: CategoryProps) {}

  static create(input: CreateCategoryInput): Category {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error("Category name is required.");
    }

    const now = new Date();
    return new Category({
      id: input.id ?? crypto.randomUUID(),
      restaurantId: input.restaurantId,
      name: input.name.trim(),
      displayOrder: input.displayOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromSnapshot(snapshot: CategorySnapshot): Category {
    return new Category(snapshot);
  }

  get id(): string { return this.props.id; }
  get restaurantId(): string { return this.props.restaurantId; }
  get name(): string { return this.props.name; }
  get displayOrder(): number { return this.props.displayOrder; }

  rename(name: string): Category {
    if (!name || name.trim().length === 0) {
      throw new Error("Category name is required.");
    }
    return new Category({ ...this.props, name: name.trim(), updatedAt: new Date() });
  }

  reorder(order: number): Category {
    return new Category({ ...this.props, displayOrder: order, updatedAt: new Date() });
  }

  toSnapshot(): CategorySnapshot {
    return { ...this.props };
  }
}
