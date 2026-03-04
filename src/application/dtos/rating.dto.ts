// src/application/dtos/rating.dto.ts

export interface RateDishInput {
  dishId: string;
  score: number;
  sessionId?: string;
}

export interface RatingOutput {
  id: string;
  dishId: string;
  score: number;
  createdAt: Date;
}
