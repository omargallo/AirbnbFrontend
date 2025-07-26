import { CommonModule } from '@angular/common';
import { Property } from './../../../core/models/Property'; // Assuming this path is correct
import { PropertyService } from './../../../core/services/Property/property.service';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BookingService } from '../../../core/services/Booking/booking.service';
import { FormsModule } from '@angular/forms';
import { CalendarAvailabilityDto, CalendarAvailabilityService } from '../../../core/services/CalendarAvailability/calendar-availability.service';
import { OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-reverse-section',
  imports: [CommonModule, FormsModule], 
  templateUrl: './reverse-section.component.html',
  styleUrls: ['./reverse-section.component.css']
})

export class ReverseSectionComponent implements OnInit ,OnChanges {
  
constructor(private propertyService: PropertyService, private bookingService: BookingService ,private calendarService: CalendarAvailabilityService) {}
  
    @Input() checkIn!: string;
    @Input() checkOut!: string;
    @Input() propertyId!: number;

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
  
    property: any;
    maxGuests = 4; 
    totalPrice: any;
    guestCount: number = 1;
    pricePerNight: number = 120; //test
    errorMessage: string | null = null;
    checkInDate: Date | null = null;
    checkOutDate: Date | null = null;
    showGuestDropdown = false;

    isDateRangeAvailable: boolean | null = null;
    unavailableDates: string[] = [];

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkIn']) {
      console.log('checkIn input changed:', this.checkIn);
    }
    if (changes['checkOut']) {
      console.log('checkOut input changed:', this.checkOut);
    }
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
      this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (property: Property) => {
        this.property = property;
        this.maxGuests = property.maxGuests;
        this.pricePerNight=property.pricePerNight
        console.log("price per neight " ,this.pricePerNight) // ✅ update maxGuests from backend
      },
      error: (err) => {
        console.error('Failed to load property data', err);
      }
    });

    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
  const currentMonthStart = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
  const nextMonthStart = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);

  const currentMonthEnd = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 0);
  const nextMonthEnd = new Date(nextMonthStart.getFullYear(), nextMonthStart.getMonth() + 1, 0);

  const format = (d: Date) => d.toISOString().split('T')[0];

  this.calendarService.getAvailability(this.propertyId, format(currentMonthStart), format(nextMonthEnd))
    .subscribe(data => {
      console.log("data from generatecalender days ")
      const availabilityMap = new Map<string, CalendarAvailabilityDto>();
      data.forEach(item => {
        availabilityMap.set(item.date, item);
      });

      this.currentMonthDays = this.getDaysInMonth(currentMonthStart, availabilityMap);
      this.nextMonthDays = this.getDaysInMonth(nextMonthStart, availabilityMap);
    });
}


  getDaysInMonth(date: Date, availabilityMap: Map<string, CalendarAvailabilityDto>): any[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
    const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: any[] = [];

  const startDayOfWeek = firstDay.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ empty: true });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const current = new Date(year, month, i);
    const dateStr = current.toISOString().split('T')[0];
    const availability = availabilityMap.get(dateStr);

    days.push({
      date: current,
      available: availability ? availability.isAvailable : false,
      price: availability?.price ?? null,
      disabled: !availability?.isAvailable || current < today
    });
  }

  return days;
}

  //when user select dates 
  selectDate(date: Date): void {

      const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to midnight for accurate comparison

  if (date < today) {
    alert("You cannot select a past date.");
    return;
  }

  const dateStr = date.toISOString().split('T')[0];
  const allDays = [...this.currentMonthDays, ...this.nextMonthDays];
  const selectedDay = allDays.find(d => d.date && this.isSameDay(d.date, date));

  if (!selectedDay || selectedDay.disabled) {
    alert("Selected date is unavailable.");
    return;
  }

  if (!this.checkInDate || this.checkOutDate) {
    this.checkInDate = date;
    this.checkOutDate = null;
    this.totalPrice = null;
  } else if (date > this.checkInDate) {
    if (this.validateDateRange(this.checkInDate, date)) {
      this.checkOutDate = date;
      this.calculateTotalPrice(this.checkInDate, this.checkOutDate);
    } else {
      const suggestion = this.findClosestAvailableRange(this.checkInDate, allDays);
      alert(`Selected range is unavailable. Try from ${suggestion.start.toDateString()} to ${suggestion.end.toDateString()}`);
    }
  } else {
    this.checkInDate = date;
    this.checkOutDate = null;
    this.totalPrice = null;
  }
}

//with guest and neights
calculateTotalPrice(start: Date, end: Date): void {
  const allDays = [...this.currentMonthDays, ...this.nextMonthDays];
  let total = 0;

  for (let day of allDays) {
    if (day.date >= start && day.date < end && day.price && day.available) {
      total += day.price;
    }
  }

  const guestCount = this.guests?.adults + this.guests?.children;
  this.totalPrice = total * guestCount; // ✅ Multiply by number of guests
  console.log("toral price from calculate " ,this.totalPrice)
  
}



findClosestAvailableRange(start: Date, allDays: any[]): { start: Date, end: Date } {
  const sorted = allDays
    .filter(d => d.date && d.available)
    .sort((a, b) => +a.date - +b.date);

  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i].date;
    const next = sorted[i + 1].date;
    const diff = (next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      return { start: curr, end: next };
    }
  }

  return { start: start, end: start };
}


    isSameDay(d1: Date, d2: Date): boolean {
      return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    validateDateRange(start: Date, end: Date): boolean {
      const allDays = [...this.currentMonthDays, ...this.nextMonthDays];
      for (let day of allDays) {
        if (day.date && day.date > start && day.date < end && day.disabled) {
          return false;
        }
      }
      return true;
    }


    isCheckIn(date: Date): boolean {
      console.log(" date that is parameter to ischeckin",date);
      return this.checkInDate ? this.isSameDay(this.checkInDate, date) : false;
      console.log("checkin date ", this.checkInDate)

    }

    isCheckOut(date: Date): boolean {
      console.log(" date that is parameter to ischeck out",date);

      return this.checkOutDate ? this.isSameDay(this.checkOutDate, date) : false;
      console.log("checkin date ", this.checkOutDate)
    }


    toggleGuestDropdown(): void {
        this.showGuestDropdown = !this.showGuestDropdown;
      }

    updateGuests(type: 'adults' | 'children' | 'infants', delta: number): void {
        const newValue = this.guests[type] + delta;
        const totalGuests = this.guests.adults + this.guests.children;

        if (type === 'adults' && newValue >= 1 && (totalGuests + delta) <= this.maxGuests) {
          this.guests.adults = newValue;
          this.errorMessage = null;
        } else if (type === 'children' && newValue >= 0 && (this.guests.adults + newValue) <= this.maxGuests) {
          this.guests.children = newValue;
          this.errorMessage = null;
        } else if (type === 'infants' && newValue >= 0) {
          this.guests.infants = newValue;
          this.errorMessage = null;
        } else {
          this.errorMessage = `Maximum ${this.maxGuests} guests allowed (excluding infants).`;
        }

        this.guestChange.emit(this.guests);

        this.guestCount = this.guests.adults + this.guests.children;
    }

  get totalGuests(): string {
    const total = this.guests.adults + this.guests.children;
    let text = `${total} guest${total !== 1 ? 's' : ''}`;
    if (this.guests.infants > 0) {
      text += `, ${this.guests.infants} infant${this.guests.infants !== 1 ? 's' : ''}`;
    }
    return text;
  }




  //will use this again  if price come with value from calender availability 
  
   // Call this when user selects both check-in and check-out
  // checkAvailabilityForSelectedRange(): void {
  //   if (!this.checkInDate || !this.checkOutDate) return;

  //   const start = moment(this.checkInDate).format('YYYY-MM-DD');
  //   const end = moment(this.checkOutDate).format('YYYY-MM-DD');

  //   this.calendarService.getAvailability(this.propertyId, start, end)
  //     .subscribe((availability: CalendarAvailabilityDto[]) => {
  //       console.log('Availability array:', availability);

  //       const allAvailable = availability.every(day => day.isAvailable);
  //       console.log('First Day:', availability[0]);

  //       this.isDateRangeAvailable = allAvailable;
  //       this.unavailableDates = availability
  //               .filter(day => !day.isAvailable)
  //                 .map(day => new Date(day.date).toISOString().split('T')[0]);

  //         if(allAvailable) {
  //         const guestCount = (this.guests?.adults || 0) +(this.guests?.children ||0);

  //         const numberOfDays = availability.length;

  //          const pricePerNight = availability.length > 0 ? availability[0].price : 0;

  //           this.totalPrice = pricePerNight * numberOfDays * guestCount;

  //            console.log('Guests:', guestCount);
  //       console.log('Days:', numberOfDays);
  //       console.log('Price/Night:', pricePerNight);
  //       console.log('Total Price:', this.totalPrice);

  //         // this.guestCount =guestCount;

  //         // this.totalPrice = 
  //         //   availability.reduce((sum, day) => sum + day.price, 0)*this.guestCount;
                
  //           // console.log("guest count " , this.guestCount, "total price to " ,this.totalPrice);
  //         }
  //          else {
  //           this.totalPrice = 0;
  //         }

  //     });

  // }


  checkAvailabilityForSelectedRange(): void {
  if (!this.checkInDate || !this.checkOutDate) return;

  const start = moment(this.checkInDate).format('YYYY-MM-DD');
  const end = moment(this.checkOutDate).format('YYYY-MM-DD');

  this.calendarService.getAvailability(this.propertyId, start, end)
    .subscribe((availability: CalendarAvailabilityDto[]) => {
      console.log('Availability array:', availability);

      const allAvailable = availability.every(day => day.isAvailable);
      this.isDateRangeAvailable = allAvailable;

      this.unavailableDates = availability
        .filter(day => !day.isAvailable)
        .map(day => new Date(day.date).toISOString().split('T')[0]);

      if (allAvailable) {
        const guestCount = (this.guests?.adults || 0) + (this.guests?.children || 0);
        const numberOfNights = moment(this.checkOutDate).diff(moment(this.checkInDate), 'days');

        const pricePerNight = this.property.pricePerNight || 0;

        // const totalBasePrice = availability
        //   .filter(day => day.isAvailable)
        //   .reduce((sum, day) => sum + (day.price || 0), 0);

        this.totalPrice = (guestCount * pricePerNight) *numberOfNights;

        console.log('Guests:', guestCount);
        console.log('Nights:', numberOfNights);
        console.log('Total Base Price:', pricePerNight);
        console.log('Total Price:', this.totalPrice);
      } else {
        this.totalPrice = 0;
        console.log("not available " , 0);
      }
    });
}



}







