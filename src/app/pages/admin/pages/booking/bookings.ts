import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookingService, BookingDetailsDTO } from '../../../../core/services/Admin/booking-service';
import { Table, TableColumn, TableAction, PaginationInfo } from '../../table/table';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css']
})
export class Bookings implements OnInit, OnDestroy {

  bookings: BookingDetailsDTO[] = [];
  loading = false;
  selectedBooking: BookingDetailsDTO | null = null;
  showBookingDetails = false;
  
  private destroy$ = new Subject<void>();

  columns: TableColumn[] = [
    { 
      label: 'Booking ID', 
      field: 'id', 
      sortable: true 
    },
    { 
      label: 'Guest Name', 
      field: 'guestName', 
      sortable: true 
    },
    { 
      label: 'Property', 
      field: 'propertyTitle', 
      sortable: true 
    },
    { 
      label: 'Check-in', 
      field: 'checkInDate', 
      pipe: 'date', 
      sortable: true 
    },
    { 
      label: 'Check-out', 
      field: 'checkOutDate', 
      pipe: 'date', 
      sortable: true  ,
      
    },
    { 
      label: 'Status', 
      field: 'bookingStatus', 
      sortable: true
    },
    { 
      label: 'Total Price', 
      field: 'totalPrice', 
      pipe: 'currency', 
      sortable: true 
    }
  ];

  actions: TableAction[] = [
    { 
      icon: 'fas fa-eye', 
      tooltip: 'View Details', 
      type: 'view', 
      color: '#007bff' 
    },
  ];

  paginationInfo: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookings(): void {
    this.loading = true;
    
    this.bookingService.getAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings) => {
          console.log('Received bookings:', bookings);
          
          if (Array.isArray(bookings)) {
            this.bookings = this.transformBookingsForTable(bookings);
            this.updatePaginationInfo(bookings.length);
          } else {
            console.error('Bookings is not an array:', bookings);
            this.bookings = [];
            this.updatePaginationInfo(0);
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.bookings = [];
          this.updatePaginationInfo(0);
          this.loading = false;
        }
      });
  }

  private transformBookingsForTable(bookings: BookingDetailsDTO[]): any[] {
    if (!Array.isArray(bookings)) {
      console.error('Expected array but received:', typeof bookings, bookings);
      return [];
    }
    
    return bookings.map(booking => ({
      ...booking,
      guestName: this.getGuestName(booking.firstName, booking.lastName),
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate
    }));
  }

  private getGuestName(firstName?: string, lastName?: string): string {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    return fullName || 'N/A';
  }

  private updatePaginationInfo(totalItems: number): void {
    this.paginationInfo = {
      ...this.paginationInfo,
      totalItems,
      totalPages: Math.ceil(totalItems / this.paginationInfo.itemsPerPage)
    };
  }

  onActionClick(event: { type: string; row: any }): void {
    const { type, row } = event;
    
    switch (type) {
      case 'view':
        this.viewBookingDetails(row);
        break;
      default:
        console.warn('Unknown action type:', type);
    }
  }

  viewBookingDetails(booking: BookingDetailsDTO): void {
    this.selectedBooking = booking;
    this.showBookingDetails = true;
  }

  closeBookingDetails(): void {
    this.showBookingDetails = false;
    this.selectedBooking = null;
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.paginationInfo.totalPages) {
      return;
    }
    
    this.paginationInfo.currentPage = page;
  }

  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort change:', event);
  }

  // Statistics getters
  get totalBookingsCount(): number {
    return this.bookings.length;
  }

  get pendingBookingsCount(): number {
    return this.bookings.filter(booking => booking.bookingStatus?.toLowerCase() === 'pending').length;
  }

  get completedBookingsCount(): number {
    return this.bookings.filter(booking => booking.bookingStatus?.toLowerCase() === 'completed').length;
  }

  get cancelledBookingsCount(): number {
    return this.bookings.filter(booking => booking.bookingStatus?.toLowerCase() === 'cancelled').length;
  }

  get confirmedBookingsCount(): number {
    return this.bookings.filter(booking => booking.bookingStatus?.toLowerCase() === 'confirmed').length;
  }

  // Revenue from completed bookings only (this is the main total)
  get totalRevenue(): number {
    return this.bookings
      .filter(booking => booking.bookingStatus?.toLowerCase() === 'confirmed')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  }

  // Revenue from pending bookings (potential revenue)
  get pendingRevenue(): number {
    return this.bookings
      .filter(booking => booking.bookingStatus?.toLowerCase() === 'pending')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  }

  // Revenue from confirmed bookings
  get confirmedRevenue(): number {
    return this.bookings
      .filter(booking => booking.bookingStatus?.toLowerCase() === 'confirmed')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  }

  // Revenue from cancelled bookings (for reference)
  get cancelledRevenue(): number {
    return this.bookings
      .filter(booking => booking.bookingStatus?.toLowerCase() === 'cancelled')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  }

  refreshBookings(): void {
    this.loadBookings();
  }

  trackByBookingId(index: number, booking: BookingDetailsDTO): number {
    return booking.id;
  }

  // Enhanced method for getting status colors and styles
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      case 'confirmed':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-badge status-completed';
      case 'pending':
        return 'status-badge status-pending';
      case 'cancelled':
        return 'status-badge status-cancelled';
      case 'confirmed':
        return 'status-badge status-confirmed';
      default:
        return 'status-badge status-default';
    }
  }

  // Method to get status icon
  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'cancelled':
        return 'fas fa-times-circle';
      case 'confirmed':
        return 'fas fa-calendar-check';
      default:
        return 'fas fa-circle';
    }
  }

  getDaysDifference(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}