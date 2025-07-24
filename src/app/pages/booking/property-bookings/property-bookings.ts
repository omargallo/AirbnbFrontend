import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyBookingService, BookingDetailsDTO } from '../../../core/services/Booking/PropertyBookingService';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../../components/header/header";

@Component({
  selector: 'app-property-bookings',
  templateUrl: './property-bookings.html',
  styleUrls: ['./property-bookings.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  providers: [DatePipe]
})
export class PropertyBookings implements OnInit {
  propertyId: number = 0;
  
  bookings: BookingDetailsDTO[] = [];
  isLoading = true;
  error: string | null = null;
  private readonly currentDate = new Date();

  constructor(
    private propertyBookingService: PropertyBookingService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get propertyId from route parameters
    this.route.params.subscribe(params => {
      const id = params['propertyId'];
      if (id) {
        this.propertyId = +id; // Convert string to number
        this.loadPropertyBookings();
      } else {
        this.error = 'Property ID not found in route';
        this.isLoading = false;
      }
    });
  }

  loadPropertyBookings(): void {
    if (!this.propertyId || this.propertyId <= 0) {
      this.error = 'Invalid property ID';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.propertyBookingService.getBookingsByPropertyId(this.propertyId).subscribe({
      next: (bookings) => {
        this.bookings = this.sortBookings(bookings);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        console.error('Error loading property bookings:', err);
      }
    });
  }

  private sortBookings(bookings: BookingDetailsDTO[]): BookingDetailsDTO[] {
    return bookings.sort((a, b) => {
      return new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime();
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
      'completed': 'status-completed',
      'confirmed': 'status-confirmed',
      'pending': 'status-pending',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status.toLowerCase()] || 'status-default';
  }

  getBookingStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'completed': 'bi-check-circle-fill',
      'confirmed': 'bi-calendar-check-fill',
      'pending': 'bi-clock-fill',
      'cancelled': 'bi-x-circle-fill'
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
    this.loadPropertyBookings();
  }

  trackByBookingId(index: number, booking: BookingDetailsDTO): number {
    return booking.id;
  }

  getPricePerNight(totalPrice: number, checkIn: string, checkOut: string): number {
    const nights = this.getNightCount(checkIn, checkOut);
    return nights > 0 ? totalPrice / nights : 0;
  }

  getGuestFullName(booking: BookingDetailsDTO): string {
    const firstName = booking.firstName || '';
    const lastName = booking.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Guest';
  }

  formatPhoneNumber(phoneNumber?: string): string {
    if (!phoneNumber) return 'Not provided';
    return phoneNumber;
  }

  getGuestCountry(booking: BookingDetailsDTO): string {
    return booking.userCountry || 'Not specified';
  }

  navigateToManageProperty(): void {
    console.log('Current propertyId:', this.propertyId); // Debug log
    console.log('Route params:', this.route.snapshot.params); // Debug route params
    
    // Try to get propertyId from route if not set in component
    let propertyIdToUse = this.propertyId;
    if (!propertyIdToUse || propertyIdToUse <= 0) {
      const routePropertyId = this.route.snapshot.params['propertyId'];
      if (routePropertyId) {
        propertyIdToUse = +routePropertyId;
        console.log('Using propertyId from route:', propertyIdToUse);
      }
    }
    
    if (propertyIdToUse && propertyIdToUse > 0) {
      console.log('Navigating to /updatelist/' + propertyIdToUse.toString());
      this.router.navigate(['/updatelist', propertyIdToUse.toString()]);
    } else {
      console.error('Invalid propertyId for navigation:', propertyIdToUse);
      console.error('Available route params:', this.route.snapshot.params);
      // Fallback - navigate to general updatelist page
      this.router.navigate(['/updatelist']);
    }
  }
}