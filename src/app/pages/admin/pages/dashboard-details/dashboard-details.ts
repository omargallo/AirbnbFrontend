import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, User } from '../../../../core/services/Admin/user-service';
import { BookingService, BookingDetailsDTO } from '../../../../core/services/Admin/booking-service';
import { PropertyService } from '../../../../core/services/Property/property.service';
import { PropertyAcceptStatus, PropertyDisplayWithHostDataDto } from '../../../add-property/models/property.model';

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
  
  // Property Statistics
  totalProperties: number = 0;
  acceptedProperties: number = 0;
  pendingProperties: number = 0;
  rejectedProperties: number = 0;
  deletedProperties: number = 0;
  averagePropertyRating: number = 0;
  
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private propertyService: PropertyService
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
    
    // Load users data
    this.loadUsersData();
    
    // Load bookings data
    this.loadBookingsData();
    
    // Load properties data
    this.loadPropertiesData();
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
          this.checkLoadingComplete();
        },
        error: (error: any) => {
          console.error('Error loading bookings data:', error);
          this.totalBookings = 0;
          this.pendingBookings = 0;
          this.completedBookings = 0;
          this.totalRevenue = 0;
          this.websiteProfit = 0;
          this.hostProfit = 0;
          this.checkLoadingComplete();
        }
      });
  }

  private loadPropertiesData(): void {
    this.propertyService.getAllForDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (properties: PropertyDisplayWithHostDataDto[]) => {
          this.processPropertiesData(properties);
          this.checkLoadingComplete();
        },
        error: (error: any) => {
          console.error('Error loading properties data:', error);
          this.totalProperties = 0;
          this.acceptedProperties = 0;
          this.pendingProperties = 0;
          this.rejectedProperties = 0;
          this.deletedProperties = 0;
          this.averagePropertyRating = 0;
          this.checkLoadingComplete();
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
      booking.bookingStatus?.toLowerCase() === 'confirmed'
    ).length;
    
    // Calculate revenue ONLY from CONFIRMED bookings (changed from completed)
    const confirmedBookingsList = bookings.filter((booking: BookingDetailsDTO) => 
      booking.bookingStatus?.toLowerCase() === 'confirmed'
    );
    
    this.totalRevenue = confirmedBookingsList.reduce((sum: number, booking: BookingDetailsDTO) => 
      sum + (booking.totalPrice || 0), 0
    );
    
    // Calculate profits based on confirmed bookings revenue - Website gets 10%, Host gets 90%
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
 private processPropertiesData(properties: PropertyDisplayWithHostDataDto[]): void {
  if (Array.isArray(properties)) {
    this.totalProperties = properties.length;
    this.acceptedProperties = properties.filter(prop => 
      prop.status === PropertyAcceptStatus.accepted
    ).length;
    
    // Fix: Use the same logic as in property.component.ts
    this.pendingProperties = properties.filter(prop => 
      prop.status === PropertyAcceptStatus.pending
    ).length;
    
    this.rejectedProperties = properties.filter(prop => 
      prop.status === PropertyAcceptStatus.rejected
    ).length;
    this.deletedProperties = properties.filter(prop => 
      prop.isDeleted
    ).length;
    
    // Calculate average rating for properties with ratings
    const propertiesWithRatings = properties.filter(prop => 
      prop.averageRating && prop.averageRating > 0
    );
    if (propertiesWithRatings.length > 0) {
      this.averagePropertyRating = propertiesWithRatings.reduce(
        (sum, prop) => sum + (prop.averageRating || 0), 0
      ) / propertiesWithRatings.length;
    } else {
      this.averagePropertyRating = 0;
    }
  } else {
    console.error('Properties data is not an array:', properties);
    this.totalProperties = 0;
    this.acceptedProperties = 0;
    this.pendingProperties = 0;
    this.rejectedProperties = 0;
    this.deletedProperties = 0;
    this.averagePropertyRating = 0;
  }
}

  private checkLoadingComplete(): void {
    // Simple counter to check if all three API calls are complete
    // You might want to implement a more sophisticated loading state management
    this.loading = false;
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

  formatRating(rating: number): string {
    return rating > 0 ? rating.toFixed(1) : '0.0';
  }

  getPropertyStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }
}