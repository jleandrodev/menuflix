// src/domain/entities/waiter-call.ts

import { InvalidTableIdentifierError } from "../errors/domain-errors";

export type WaiterCallStatus = "pending" | "acknowledged" | "completed";

export interface WaiterCallProps {
  id: string;
  restaurantId: string;
  tableIdentifier: string;
  status: WaiterCallStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWaiterCallInput {
  id?: string;
  restaurantId: string;
  tableIdentifier: string;
}

export interface WaiterCallSnapshot {
  id: string;
  restaurantId: string;
  tableIdentifier: string;
  status: WaiterCallStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class WaiterCall {
  private constructor(private readonly props: WaiterCallProps) {}

  static create(input: CreateWaiterCallInput): WaiterCall {
    if (!input.tableIdentifier || input.tableIdentifier.trim().length === 0) {
      throw new InvalidTableIdentifierError();
    }

    const now = new Date();
    return new WaiterCall({
      id: input.id ?? crypto.randomUUID(),
      restaurantId: input.restaurantId,
      tableIdentifier: input.tableIdentifier.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromSnapshot(snapshot: WaiterCallSnapshot): WaiterCall {
    return new WaiterCall(snapshot);
  }

  get id(): string { return this.props.id; }
  get restaurantId(): string { return this.props.restaurantId; }
  get tableIdentifier(): string { return this.props.tableIdentifier; }
  get status(): WaiterCallStatus { return this.props.status; }

  acknowledge(): WaiterCall {
    return new WaiterCall({ ...this.props, status: "acknowledged", updatedAt: new Date() });
  }

  complete(): WaiterCall {
    return new WaiterCall({ ...this.props, status: "completed", updatedAt: new Date() });
  }

  toSnapshot(): WaiterCallSnapshot {
    return { ...this.props };
  }
}
