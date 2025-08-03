import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/Notification/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Notification } from '../../core/models/Notification';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Loader } from "../../shared/components/loader/loader";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule, Loader],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscriptions: Subscription = new Subscription();
  loading = false;
  error: string | null = null;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.subscribeToNewNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.notificationService.stopConnection();
  }

  private loadNotifications(): void {
    const userId = this.authService.userId || '';
    const token = this.authService.accessToken || '';

    this.loading = true;
    this.error = null;

    this.notificationService.startConnection(token);

    const notificationsSub = this.notificationService.getNotificationsByUserId(userId).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.updateUnreadCount();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.error = 'Failed to load notifications';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.subscriptions.add(notificationsSub);
  }

  private subscribeToNewNotifications(): void {
    const newNotificationSub = this.notificationService.newNotification$.subscribe((notification) => {
      console.log('New notification received in component:', notification);
      
      if (notification && notification.id) {
        const exists = this.notifications.find(n => n.id === notification.id);
        if (!exists) {
          this.notifications.unshift(notification);
          this.updateUnreadCount();
          this.cdr.detectChanges(); 
        }
      } else {
        console.warn('Received notification without ID:', notification);
        this.refreshNotifications();
      }
    });

    this.subscriptions.add(newNotificationSub);
  }

  private refreshNotifications(): void {
    const userId = this.authService.userId || '';
    
    const refreshSub = this.notificationService.getNotificationsByUserId(userId).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.updateUnreadCount();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error refreshing notifications:', err);
      }
    });

    this.subscriptions.add(refreshSub);
  }

  private updateUnreadCount(): void {
    this.notificationService.unReadCount = this.notifications.filter(n => !n.isRead).length;
    localStorage.setItem('unReadCount', this.notificationService.unReadCount.toString());
  }

  markAsRead(notification: Notification): void {
    if (!notification.id || notification.isRead) return;

    const markReadSub = this.notificationService.setNotificationRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.updateUnreadCount();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error marking notification as read:', err);
      }
    });

    this.subscriptions.add(markReadSub);
  }

  deleteNotification(notification: Notification): void {
    if (!notification.id) return;

    const deleteSub = this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.updateUnreadCount();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting notification:', err);
      }
    });

    this.subscriptions.add(deleteSub);
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(n => !n.isRead && n.id);

    unreadNotifications.forEach(notification => {
      if (notification.id) {
        this.markAsRead(notification);
      }
    });
  }

  clearAllNotifications(): void {
    const notificationsWithId = this.notifications.filter(n => n.id);

    notificationsWithId.forEach(notification => {
      if (notification.id) {
        this.deleteNotification(notification);
      }
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getFormattedDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }

  refreshManually(): void {
    this.refreshNotifications();
  }
}