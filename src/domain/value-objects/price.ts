// src/domain/value-objects/price.ts
// Value Object for monetary price (stored in cents)

export class Price {
  private constructor(private readonly valueInCents: number) {}

  static create(valueInCents: number): Price {
    if (!Number.isInteger(valueInCents) || valueInCents < 0) {
      throw new Error("Price must be a non-negative integer (in cents)");
    }
    return new Price(valueInCents);
  }

  static fromReais(reais: number): Price {
    return Price.create(Math.round(reais * 100));
  }

  get cents(): number {
    return this.valueInCents;
  }

  get reais(): number {
    return this.valueInCents / 100;
  }

  isNegative(): boolean {
    return this.valueInCents < 0;
  }

  isZero(): boolean {
    return this.valueInCents === 0;
  }

  format(locale = "pt-BR", currency = "BRL"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(this.reais);
  }

  equals(other: Price): boolean {
    return this.valueInCents === other.valueInCents;
  }
}
