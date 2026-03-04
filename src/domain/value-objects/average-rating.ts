// src/domain/value-objects/average-rating.ts
// Value Object for calculated average rating

export class AverageRating {
  private constructor(
    private readonly average: number,
    private readonly count: number
  ) {}

  static create(average: number, count: number): AverageRating {
    if (count < 0) {
      throw new Error("Rating count cannot be negative");
    }
    if (count === 0) {
      return new AverageRating(0, 0);
    }
    if (average < 1 || average > 5) {
      throw new Error("Average rating must be between 1 and 5");
    }
    return new AverageRating(Math.round(average * 10) / 10, count);
  }

  static empty(): AverageRating {
    return new AverageRating(0, 0);
  }

  static recalculate(currentAvg: number, currentCount: number, newScore: number): AverageRating {
    const newCount = currentCount + 1;
    const newAvg = (currentAvg * currentCount + newScore) / newCount;
    return AverageRating.create(newAvg, newCount);
  }

  get value(): number {
    return this.average;
  }

  get totalCount(): number {
    return this.count;
  }

  hasRatings(): boolean {
    return this.count > 0;
  }

  format(): string {
    if (!this.hasRatings()) return "Sem avaliações";
    return `${this.average.toFixed(1)} (${this.count})`;
  }

  equals(other: AverageRating): boolean {
    return this.average === other.average && this.count === other.count;
  }
}
