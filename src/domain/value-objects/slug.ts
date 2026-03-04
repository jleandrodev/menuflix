// src/domain/value-objects/slug.ts
// Value Object for restaurant slug

export class Slug {
  private static readonly VALID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  private constructor(private readonly value: string) {}

  static create(value: string): Slug {
    const normalized = value.toLowerCase().trim();
    if (!Slug.VALID_PATTERN.test(normalized)) {
      throw new Error(
        `Invalid slug format: "${value}". Slug must contain only lowercase letters, numbers, and hyphens.`
      );
    }
    if (normalized.length < 2 || normalized.length > 63) {
      throw new Error("Slug must be between 2 and 63 characters long.");
    }
    return new Slug(normalized);
  }

  static fromString(value: string): Slug {
    const slug = value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return Slug.create(slug);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
