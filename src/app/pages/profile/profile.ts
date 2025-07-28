import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/User/user.service';
import { AuthService } from '../../core/services/auth.service';
import { HandleImgService } from '../../core/services/handleImg.service';
import { Router, RouterModule } from '@angular/router';
import {
  UserBookingService,
  BookingDetailsDTO,
} from '../../core/services/Booking/user-booking-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [DatePipe],
})
export class Profile implements OnInit {
  selectedSection: string = 'aboutMe';
  authService = inject(AuthService);
  constructor(
    private userService: UserService,
    private router: Router,
    private userBookingService: UserBookingService,
    private datePipe: DatePipe
  ) {}
  userId = this.authService.userId;
  roles = this.authService.role;
  handleImgService = inject(HandleImgService);
  user: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser
      ? JSON.parse(storedUser)?.firstName ?? JSON.parse(storedUser)?.userName
      : '';
  })();

  ifImg: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : '';
  })();

  img: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return this.handleImgService.handleImage(
      storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : ''
    );
  })();

  country: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.country ?? '' : '';
  })();

  bookings: BookingDetailsDTO[] = [];
  isLoading = true;
  error: string | null = null;

  private readonly currentDate = new Date();

  ngOnInit(): void {
    this.loadUserBookings();
  }

  loadUserBookings(): void {
    this.isLoading = true;
    this.error = null;

    this.userId = this.authService.userId;

    if (!this.userId) {
      this.error = 'User ID is not available.';
      this.isLoading = false;
      return;
    }

    this.userBookingService.getBookingsByUserId(this.userId).subscribe({
      next: (bookings) => {
        this.bookings = this.sortBookings(bookings);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        console.error('Error loading bookings:', err);
      },
    });
  }

  private sortBookings(bookings: BookingDetailsDTO[]): BookingDetailsDTO[] {
    return bookings.sort((a, b) => {
      return (
        new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
      );
    });
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'MMM d, yyyy') || dateString;
    } catch {
      return dateString;
    }
  }

  formatShortDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'MMM d') || dateString;
    } catch {
      return dateString;
    }
  }

  // New method to format dates with year
  formatDateWithYear(dateString: string): string {
    try {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'MMM d, yyyy') || dateString;
    } catch {
      return dateString;
    }
  }

  formatShortDateWithYear(dateString: string): string {
    try {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'MMM d, yy') || dateString;
    } catch {
      return dateString;
    }
  }

  getBookingStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      completed: 'status-completed',
      confirmed: 'status-confirmed',
      pending: 'status-pending',
      cancelled: 'status-cancelled',
    };
    return statusMap[status.toLowerCase()] || 'status-default';
  }

  getBookingStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      completed: 'bi-check-circle-fill',
      confirmed: 'bi-calendar-check-fill',
      pending: 'bi-clock-fill',
      cancelled: 'bi-x-circle-fill',
    };
    return iconMap[status.toLowerCase()] || 'bi-circle-fill';
  }

  isUpcomingBooking(checkInDateString: string): boolean {
    try {
      const checkInDate = new Date(checkInDateString);
      return checkInDate > this.currentDate;
    } catch {
      return false;
    }
  }

  isPastBooking(checkOutDateString: string): boolean {
    try {
      const checkOutDate = new Date(checkOutDateString);
      return checkOutDate < this.currentDate;
    } catch {
      return false;
    }
  }

  getBookingTypeLabel(booking: BookingDetailsDTO): string {
    if (this.isUpcomingBooking(booking.checkInDate)) {
      return 'Upcoming';
    } else if (this.isPastBooking(booking.checkOutDate)) {
      return 'Past';
    } else {
      return 'Current';
    }
  }

  getNightCount(checkIn: string, checkOut: string): number {
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    } catch {
      return 0;
    }
  }

  refreshBookings(): void {
    this.loadUserBookings();
  }

  trackByBookingId(index: number, booking: BookingDetailsDTO): number {
    return booking.id;
  }

  getPricePerNight(
    totalPrice: number,
    checkIn: string,
    checkOut: string
  ): number {
    const nights = this.getNightCount(checkIn, checkOut);
    return nights > 0 ? totalPrice / nights : 0;
  }
}
