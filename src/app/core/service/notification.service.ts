import { Injectable } from '@angular/core';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {BehaviorSubject, Observable} from "rxjs";
import {NotificationPlaceHolder, Notifications} from "@core/models/Notifications";
import {AuthService} from "@core";
import {webSocket} from "rxjs/webSocket";
import {convertNotificationFromDto} from "@core/converters/NotificationDTOConverter";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket$!: WebSocketSubject<any>;
  private notificationsSubject = new BehaviorSubject<NotificationPlaceHolder[]>([]);  // Holds the notifications list

  constructor(private authService: AuthService) {
    this.connectWebSocket();  // Establish WebSocket connection
  }

  // Establish and maintain WebSocket connection
  private connectWebSocket() {
    this.socket$ = webSocket(`${environment.wsUrl}?token=${this.authService.currentUserValue.token}`);

    // Subscribe to WebSocket messages
    this.socket$.subscribe(
      (message) => this.handleNewNotifications(message),  // Handle incoming notifications
      (error) => this.handleError(error),  // Handle WebSocket errors
      () => this.handleConnectionClosed()  // Simply log closure without reopening a new connection
    );
  }

  // Handle incoming WebSocket notifications
  private handleNewNotifications(notification: Notifications) {

    const convertedNotification = convertNotificationFromDto(notification);  // Convert to the appropriate type

    // Append the new notification to the existing notifications
    const currentNotifications = this.notificationsSubject.getValue();
    const updatedNotifications = [...currentNotifications, ...convertedNotification];

    // Update the BehaviorSubject with the new array of notifications
    this.notificationsSubject.next(updatedNotifications);
  }

  // Return notifications as an observable to the component
  getNotifications(): Observable<NotificationPlaceHolder[]> {
    return this.notificationsSubject.asObservable();
  }

  // Action: Fetch initial notifications
  fetchInitialNotifications() {
    this.socket$.next({ action: 'fetchNotifications' });
  }

  // Action: Mark notification as read
  markAsRead() {
    this.socket$.next({ action: 'markAllAsRead' });
  }

  // Handle WebSocket errors
  private handleError(error: any) {
    console.error('WebSocket error:', error);
    // Here you could show a UI message or trigger a manual reconnect if desired
  }

  // Handle WebSocket connection closure (no reconnection logic)
  private handleConnectionClosed() {
    console.log('WebSocket connection closed.');
    // No reconnection logic here, simply log the event
  }
}
