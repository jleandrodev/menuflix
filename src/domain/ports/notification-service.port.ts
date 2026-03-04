// src/domain/ports/notification-service.port.ts
// ACL interface for notifications

export interface NotifyWaiterInput {
  restaurantId: string;
  tableIdentifier: string;
  callId: string;
}

export interface INotificationService {
  notifyWaiterCall(input: NotifyWaiterInput): Promise<void>;
}
