// src/domain/errors/domain-errors.ts
// Typed domain errors

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidDishPriceError extends DomainError {
  constructor() {
    super("Dish price must be a positive value.");
  }
}

export class InvalidRatingScoreError extends DomainError {
  constructor(score: number) {
    super(`Rating score must be between 1 and 5. Received: ${score}`);
  }
}

export class DishNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Dish not found: ${id}`);
  }
}

export class RestaurantNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Restaurant not found: ${identifier}`);
  }
}

export class InvalidSlugError extends DomainError {
  constructor(slug: string) {
    super(`Invalid slug format: "${slug}"`);
  }
}

export class CategoryNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Category not found: ${id}`);
  }
}

export class InvalidTableIdentifierError extends DomainError {
  constructor() {
    super("Table identifier is required.");
  }
}

export class UnauthorizedError extends DomainError {
  constructor() {
    super("Unauthorized access.");
  }
}
