// src/domain/entities/rating.ts

import { InvalidRatingScoreError } from "../errors/domain-errors";

export interface RatingProps {
  id: string;
  dishId: string;
  score: number;
  sessionId: string | null;
  createdAt: Date;
}

export interface CreateRatingInput {
  id?: string;
  dishId: string;
  score: number;
  sessionId?: string | null;
}

export interface RatingSnapshot {
  id: string;
  dishId: string;
  score: number;
  sessionId: string | null;
  createdAt: Date;
}

export class Rating {
  private constructor(private readonly props: RatingProps) {}

  static create(input: CreateRatingInput): Rating {
    if (!Number.isInteger(input.score) || input.score < 1 || input.score > 5) {
      throw new InvalidRatingScoreError(input.score);
    }

    return new Rating({
      id: input.id ?? crypto.randomUUID(),
      dishId: input.dishId,
      score: input.score,
      sessionId: input.sessionId ?? null,
      createdAt: new Date(),
    });
  }

  static fromSnapshot(snapshot: RatingSnapshot): Rating {
    return new Rating(snapshot);
  }

  get id(): string { return this.props.id; }
  get dishId(): string { return this.props.dishId; }
  get score(): number { return this.props.score; }
  get sessionId(): string | null { return this.props.sessionId; }
  get createdAt(): Date { return this.props.createdAt; }

  toSnapshot(): RatingSnapshot {
    return { ...this.props };
  }
}
