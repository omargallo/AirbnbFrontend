import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDays, format, isSameDay } from 'date-fns';
import { CalendarComponent, CalendarSettings, DayAvailability } from "../../components/calendar/calendar";
import { CalendarFullSettings, CalendarSettingsComponent } from "../../components/calendar-settings/calendar-settings";

export interface SelectedNightInfo {
  nights: number;
  basePrice: number;
  totalPrice: number;
  discountRange?: {
    min: number;
    max: number;
  };
  hasDiscount: boolean;
}

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, CalendarComponent, CalendarSettingsComponent],
  templateUrl: './availability-page.html',
  styleUrls: ['./availability-page.css'],
})
export class Availability implements OnInit {
  showBlockOptions = false;
  constructor(private cd: ChangeDetectorRef) { }

  calendarSettings: CalendarSettings = {
    viewType: 'year',
    selectedDates: [],
    availability: [],
    minNights: 1,
    maxNights: 365,
  };

  fullSettings: CalendarFullSettings = {
    pricing: {
      basePrice: 37,
      customWeekendPrice: 37,
      smartPricingEnabled: false,
      currency: 'USD',
    },
    discounts: {
      weeklyDiscount: {
        enabled: true,
        percentage: 10,
        minNights: 7,
      },
      monthlyDiscount: {
        enabled: true,
        percentage: 20,
        minNights: 28,
      },
      earlyBirdDiscount: {
        enabled: false,
        percentage: 0,
        daysInAdvance: 30,
      },
      lastMinuteDiscount: {
        enabled: true,
        percentage: 15,
        hoursBeforeCheckIn: 24,
      },
    },
    availability: {
      minNights: 1,
      maxNights: 365,
      advanceNotice: 'same-day',
      sameDayNoticeTime: '12:00',
      preparationTime: 'none',
      availabilityWindow: '12 months in advance',
      checkInDays: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
      checkOutDays: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
    },
  };

  selectedNightInfo: SelectedNightInfo | null = null;
  availabilityMode: 'open' | 'blocked' = 'open';

  ngOnInit() {
    this.generateAvailabilityData();
    this.syncCalendarSettings();
  }

  generateAvailabilityData() {
    const today = new Date();
    const availability: DayAvailability[] = [];

    // Generate 365 days of availability data
    for (let i = 0; i < 365; i++) {
      const date = addDays(today, i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      let price = this.fullSettings.pricing.basePrice;
      let originalPrice = price;

      // Apply weekend pricing
      if (isWeekend && this.fullSettings.pricing.customWeekendPrice) {
        price = this.fullSettings.pricing.customWeekendPrice;
        originalPrice = price;
      }

      // Randomly make some dates $71 (higher price)
      if (Math.random() > 0.7) {
        price = 71;
        originalPrice = price;
      }

      // Some dates have discounts
      const hasDiscount = Math.random() > 0.8;
      if (hasDiscount) {
        originalPrice = price;
        price = Math.round(price * 0.85); // 15% discount
      }

      availability.push({
        date,
        available: Math.random() > 0.1, // 90% availability
        price,
        originalPrice: hasDiscount ? originalPrice : undefined,
      });
    }

    this.calendarSettings.availability = availability;
  }

  syncCalendarSettings() {
    this.calendarSettings.minNights = this.fullSettings.availability.minNights;
    this.calendarSettings.maxNights = this.fullSettings.availability.maxNights;
  }

  onDateSelected(selectedDates: Date[]) {
    this.calendarSettings.selectedDates = selectedDates;
    this.showBlockOptions = true;

    if (selectedDates.length === 2) {
      const [startDate, endDate] = selectedDates.sort(
        (a, b) => a.getTime() - b.getTime()
      );
      const nights = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate pricing
      const basePrice = this.fullSettings.pricing.basePrice;
      const totalPrice = basePrice * nights;

      // Check for discounts
      const hasLastMinuteDiscount =
        this.fullSettings.discounts.lastMinuteDiscount.enabled;
      const discountRange = hasLastMinuteDiscount
        ? {
          min: Math.round(basePrice * 0.85),
          max: basePrice,
        }
        : undefined;

      this.selectedNightInfo = {
        nights,
        basePrice,
        totalPrice,
        discountRange,
        hasDiscount: hasLastMinuteDiscount,
      };
    } else {
      this.selectedNightInfo = null;
    }
    this.cd.markForCheck();
  }

  onCalendarSettingsChanged(settings: CalendarSettings) {
    this.calendarSettings = settings;
  }

  onFullSettingsChanged(settings: CalendarFullSettings) {
    this.fullSettings = settings;
    this.syncCalendarSettings();
    this.generateAvailabilityData(); // Regenerate with new pricing
  }

  setAvailabilityMode(mode: 'open' | 'blocked') {
    this.availabilityMode = mode;
  }

  clearSelection() {
    this.calendarSettings.selectedDates = [];
    this.selectedNightInfo = null;
  }

  showDiscountDetails() {
    console.log('Show discount details modal');
  }

  showSimilarListings() {
    console.log('Show similar listings modal');
  }

  addPrivateNote() {
    console.log('Add private note modal');
  }

  addBlockedNote() {
    console.log('Add blocked note modal');
  }

  saveChanges() {
    if (
      !this.selectedNightInfo ||
      this.calendarSettings.selectedDates.length !== 2
    ) {
      return;
    }

    const [startDate, endDate] = this.calendarSettings.selectedDates.sort(
      (a, b) => a.getTime() - b.getTime()
    );

    // Update availability for selected date range
    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const existingIndex = this.calendarSettings.availability.findIndex((a) =>
        isSameDay(a.date, currentDate)
      );

      if (existingIndex >= 0) {
        this.calendarSettings.availability[existingIndex].available =
          this.availabilityMode === 'open';
      } else {
      }
    }
  }
}
