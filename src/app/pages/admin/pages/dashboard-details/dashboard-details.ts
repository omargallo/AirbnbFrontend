import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, User } from '../../../../core/services/Admin/user-service';
import { BookingService, BookingDetailsDTO } from '../../../../core/services/Admin/booking-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-details.html',
  styleUrls: ['./dashboard-details.css']
})
export class DashboarDetails implements OnInit, OnDestroy {
  
  // Dashboard Statistics
  totalUsers: number = 0;
  totalBookings: number = 0;
  activeUsers: number = 0;
  pendingBookings: number = 0;
  completedBookings: number = 0;
  totalRevenue: number = 0;
  websiteProfit: number = 0;
  hostProfit: number = 0;
  
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load users data first
    this.loadUsersData();
    
    // Load bookings data
    this.loadBookingsData();
  }

  private loadUsersData(): void {
    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: User[]) => {
          this.processUsersData(users);
        },
        error: (error: any) => {
          console.error('Error loading users data:', error);
          this.totalUsers = 0;
          this.activeUsers = 0;
        }
      });
  }

  private loadBookingsData(): void {
    this.bookingService.getAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings: BookingDetailsDTO[]) => {
          this.processBookingsData(bookings);
          this.loading = false; // Set loading to false after both requests
        },
        error: (error: any) => {
          console.error('Error loading bookings data:', error);
          this.totalBookings = 0;
          this.pendingBookings = 0;
          this.completedBookings = 0;
          this.totalRevenue = 0;
          this.websiteProfit = 0;
          this.hostProfit = 0;
          this.loading = false;
        }
      });
  }

  private processUsersData(users: User[]): void {
    if (Array.isArray(users)) {
      this.totalUsers = users.length;
      this.activeUsers = users.filter((user: User) => user.isConfirmed).length;
    } else {
      console.error('Users data is not an array:', users);
      this.totalUsers = 0;
      this.activeUsers = 0;
    }
  }

  private processBookingsData(bookings: BookingDetailsDTO[]): void {
    if (Array.isArray(bookings)) {
      this.totalBookings = bookings.length;
      this.pendingBookings = bookings.filter((booking: BookingDetailsDTO) => 
        booking.bookingStatus?.toLowerCase() === 'pending'
      ).length;
      this.completedBookings = bookings.filter((booking: BookingDetailsDTO) => 
        booking.bookingStatus?.toLowerCase() === 'completed'
      ).length;
      this.totalRevenue = bookings.reduce((sum: number, booking: BookingDetailsDTO) => 
        sum + (booking.totalPrice || 0), 0
      );
      
      // Calculate profits - Website gets 10%, Host gets 90%
      this.websiteProfit = this.totalRevenue * 0.10;
      this.hostProfit = this.totalRevenue * 0.90;
    } else {
      console.error('Bookings data is not an array:', bookings);
      this.totalBookings = 0;
      this.pendingBookings = 0;
      this.completedBookings = 0;
      this.totalRevenue = 0;
      this.websiteProfit = 0;
      this.hostProfit = 0;
    }
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  // Utility methods for formatting
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getPercentage(part: number, total: number): number {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }
}