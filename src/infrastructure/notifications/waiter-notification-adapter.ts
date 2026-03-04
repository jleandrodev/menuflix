// src/infrastructure/notifications/waiter-notification-adapter.ts
// ACL adapter for waiter notifications — simple console log for development

import { INotificationService, NotifyWaiterInput } from "@/domain/ports/notification-service.port";

export class ConsoleNotificationAdapter implements INotificationService {
  async notifyWaiterCall(input: NotifyWaiterInput): Promise<void> {
    console.log(
      `[WAITER CALL] Restaurant: ${input.restaurantId} | Table: ${input.tableIdentifier} | Call ID: ${input.callId}`
    );
    // In production: WebSocket, push notification, or integration with tablet app
  }
}
