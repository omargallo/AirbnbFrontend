// reverse-section.component.ts
import { CommonModule } from '@angular/common';
import { Property } from './../../../core/models/Property'; // Assuming this path is correct
import { PropertyService } from './../../../core/services/Property/property.service';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BookingService } from '../../../core/services/Booking/booking.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reverse-section',
  imports: [CommonModule, FormsModule], 
  templateUrl: './reverse-section.component.html',
  styleUrls: ['./reverse-section.component.css']
})
export class ReverseSectionComponent implements OnInit {
  
  constructor(private propertyService: PropertyService, private bookingService: BookingService) {}
  
   @Input() checkIn!: string;
  @Input() checkOut!: string;

  @Output() guestChange = new EventEmitter<{
    adults: number;
    children: number;
    infants: number;
  }>();

    @Input() guests: {
    adults: number;
    children: number;
    infants: number;
  } = { adults: 1, children: 0, infants: 0 }; // Default values

  @Input() propertyId!: number;
  property: any;

  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  guestCount: number = 1;
  pricePerNight: number = 120; //test

  isSticky = true;
  totalPrice: any;

  showGuestDropdown = false;

  maxGuests = 4; // Maximum guests allowed (excluding infants)


  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isSticky = window.scrollY > 300;
  }


  // Calendar properties
  currentMonth: Date = new Date(); 
  weekDays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  currentMonthDays: any[] = [];
  nextMonthDays: any[] = [];
  showNextMonth: boolean = true; // Always show next month as per image

  get currentMonthName(): string {
    return this.currentMonth.toLocaleString('en-US', { month: 'long' });
  }

  get currentYear(): number {
    return this.currentMonth.getFullYear();
  }

  get nextMonthName(): string {
    const next = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    return next.toLocaleString('en-US', { month: 'long' });
  }

  get nextMonthYear(): number {
    const next = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    return next.getFullYear();
  }


  ngOnInit() {
    if (!this.propertyId) {
      console.error('Property ID is required for ReverseSectionComponent');
    }
    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    this.currentMonthDays = this.getDaysInMonth(this.currentMonth);

    // Calculate next month's date
    const nextMonthDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.nextMonthDays = this.getDaysInMonth(nextMonthDate);
  }

  getDaysInMonth(date: Date): any[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDays = lastDayOfMonth.getDate();

    const days: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    // Add empty slots for days before the 1st of the month
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ empty: true });
    }

    // Add actual days
    for (let i = 1; i <= numDays; i++) {
      const currentDate = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day

      days.push({
        date: currentDate,
        disabled: currentDate < today // Disable dates before today
      });
    }
    return days;
  }

  selectDate(date: Date): void {
      const todayStartOfDay = new Date();
  todayStartOfDay.setHours(0, 0, 0, 0); // Get the start of today as a Date object

    if (date.getTime() < todayStartOfDay.getTime()) { // Re-check disabled for safety
      return; // Do nothing if the date is disabled (in the past)
    }

    if (!this.checkInDate || this.checkOutDate) {
      // If no check-in is set, or if both are set (meaning a new selection cycle)
      this.checkInDate = date;
      this.checkOutDate = null; // Clear checkout to start new range
    } else if (date < this.checkInDate) {
      // If selected date is before check-in, make it new check-in
      this.checkInDate = date;
      this.checkOutDate = null; // Clear checkout
    } else if (date > this.checkInDate) {
      // If selected date is after check-in, make it new check-out
      this.checkOutDate = date;
    }
    // No action if same date is clicked twice or if checkOutDate is not null and checkInDate is null
  }

  isCheckIn(date: Date): boolean {
    return this.checkInDate ? this.isSameDay(this.checkInDate, date) : false;
  }

  isCheckOut(date: Date): boolean {
    return this.checkOutDate ? this.isSameDay(this.checkOutDate, date) : false;
  }

  isInRange(date: Date): boolean {
    if (this.checkInDate && this.checkOutDate) {
      return date > this.checkInDate && date < this.checkOutDate;
    } else if (this.checkInDate && !this.checkOutDate) {
      // If only check-in is selected, don't highlight anything else as "in range" yet
      return false;
    }
    return false;
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(today, date);
  }

  clearDates(): void {
    this.checkInDate = null;
    this.checkOutDate = null;
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendarDays();
  }

  checkAvailability(): void {
    // Implement your availability check logic here
    // This could involve calling your bookingService with checkInDate, checkOutDate, and guestCount
    console.log('Checking availability for:', this.checkInDate, this.checkOutDate, this.guestCount);
    if (this.checkInDate && this.checkOutDate && this.guestCount) {
    
    } else {
      alert('Please select check-in and check-out dates and guest count.');
    }
  }



 


 toggleGuestDropdown(): void {
    this.showGuestDropdown = !this.showGuestDropdown;
  }

  updateGuests(type: 'adults' | 'children' | 'infants', delta: number): void {
    const newValue = this.guests[type] + delta;
    if (type === 'adults') {
      if (newValue >= 1 && (this.guests.adults + this.guests.children) <= this.maxGuests) {
        this.guests[type] = newValue;
      }
    } else if (type === 'children') {
      if (newValue >= 0 && (this.guests.adults + newValue) <= this.maxGuests) {
        this.guests[type] = newValue;
      }
    } else if (type === 'infants' ) {
      if (newValue >= 0) {
        this.guests[type] = newValue;
      }
    }
    
    this.guestChange.emit(this.guests);
  }

  get totalGuests(): string {
    const total = this.guests.adults + this.guests.children;
    let text = `${total} guest${total !== 1 ? 's' : ''}`;
    if (this.guests.infants > 0) {
      text += `, ${this.guests.infants} infant${this.guests.infants !== 1 ? 's' : ''}`;
    }
    return text;
  }







}







