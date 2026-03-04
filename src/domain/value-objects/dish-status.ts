// src/domain/value-objects/dish-status.ts
// Value Object for dish active/inactive status

export type DishStatusValue = "active" | "inactive";

export class DishStatus {
  private constructor(private readonly value: DishStatusValue) {}

  static active(): DishStatus {
    return new DishStatus("active");
  }

  static inactive(): DishStatus {
    return new DishStatus("inactive");
  }

  static from(isActive: boolean): DishStatus {
    return isActive ? DishStatus.active() : DishStatus.inactive();
  }

  isActive(): boolean {
    return this.value === "active";
  }

  toggle(): DishStatus {
    return this.isActive() ? DishStatus.inactive() : DishStatus.active();
  }

  toString(): string {
    return this.value;
  }

  equals(other: DishStatus): boolean {
    return this.value === other.value;
  }
}
