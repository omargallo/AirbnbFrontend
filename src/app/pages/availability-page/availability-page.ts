import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDays, format, isSameDay } from 'date-fns';
import { CalendarComponent, CalendarSettings, DayAvailability } from "../../components/calendar/calendar";
import { CalendarDateDTO, CalendarService } from '../../core/services/Calendar/calendar.service';
import { finalize } from 'rxjs';
import { CalendarFullSettings, CalendarSettingsComponent } from "../../components/calendar-settings/calendar-settings";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { parseISO } from 'date-fns';


@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, CalendarComponent, CalendarSettingsComponent, TranslateModule],
  templateUrl: './availability-page.html',
  styleUrls: ['./availability-page.css'],
})
export class Availability implements OnInit {

  isLoading = false;
  selectedPropertyId: string | null = null;

  showBlockOptions = false;
  constructor(private cd: ChangeDetectorRef, private calendarService: CalendarService, private translate: TranslateService) { }


  onPropertySelected(propertyId: string) {
    this.selectedPropertyId = propertyId;
    this.loadPropertyCalendarData();
  }


  private loadPropertyCalendarData() {
    if (!this.selectedPropertyId) return;

    this.isLoading = true;
    const today = new Date();
    const endDate = addDays(today, 365);

    this.calendarService.getPropertyCalendar(
      parseInt(this.selectedPropertyId),
      format(today, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    ).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cd.markForCheck();
      })
    ).subscribe({
      next: (calendarData: CalendarDateDTO[]) => {
        this.mapCalendarDataToAvailability(calendarData);
        console.log("calendarData", calendarData)
      },
      error: (error) => {
        this.translate.instant('AVAILABILITY.ERRORS.LOAD_FAILED')
      }
    });
  }

  private mapCalendarDataToAvailability(calendarData: CalendarDateDTO[]) {
    const today = new Date();
    const availability: DayAvailability[] = [];

    const dataMap = new Map<string, CalendarDateDTO>();

    calendarData.forEach(item => {
      // const normalizedKey = format(parseISO(item.date), 'yyyy-MM-dd');
      const normalizedKey = item.date.slice(0, 10);
      dataMap.set(normalizedKey, item);
    });

    for (let i = 0; i < 365; i++) {
      const date = addDays(today, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const backendData = dataMap.get(dateKey);

      if (backendData) {
        availability.push({
          date,
          available: backendData.isAvailable ?? true,
          price: backendData.price ?? 0,
          originalPrice: undefined,
          isBooked: backendData.isBooked ?? false
        });
      } else {
        availability.push({
          date,
          available: true,
          price: 0,
          originalPrice: undefined,
          isBooked: false
        });
      }
    }

    this.calendarSettings = {
      ...this.calendarSettings,
      availability: [...availability]
    };
    this.cd.detectChanges();
  }



  calendarSettings: CalendarSettings = {
    viewType: 'year',
    selectedDates: [],
    availability: [],
    minNights: 1,
    maxNights: 365,
  };

  fullSettings: CalendarFullSettings = {
    pricing: {
      basePrice: 0,
      smartPricingEnabled: false,
      currency: 'USD',
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

  availabilityMode: 'open' | 'blocked' = 'open';
  selectedDatePrice: number = 0;
  ngOnInit() {

    this.syncCalendarSettings();
  }

  syncCalendarSettings() {
    this.calendarSettings.minNights = this.fullSettings.availability.minNights;
    this.calendarSettings.maxNights = this.fullSettings.availability.maxNights;
  }

  onDateSelected(selectedDates: Date[]) {
    this.calendarSettings.selectedDates = selectedDates;
    this.showBlockOptions = selectedDates.length > 0;

    // Set price for first selected date
    if (selectedDates.length > 0) {
      const firstDate = selectedDates[0];
      const firstDateAvailability = this.calendarSettings.availability.find(a =>
        isSameDay(a.date, firstDate)
      );
      this.selectedDatePrice = firstDateAvailability?.price != null
        ? firstDateAvailability.price
        : this.fullSettings.pricing.basePrice;
    } else {
      this.selectedDatePrice = 0;
    }

    this.cd.markForCheck();
  }

  onCalendarSettingsChanged(settings: CalendarSettings) {
    this.calendarSettings = settings;
  }

  onFullSettingsChanged(settings: CalendarFullSettings) {
    this.fullSettings = settings;
    this.syncCalendarSettings();
    if (this.selectedPropertyId) {
      this.loadPropertyCalendarData();
    }
  }

  setAvailabilityMode(mode: 'open' | 'blocked') {
    this.availabilityMode = mode;
    this.cd.markForCheck();
  }

  onPriceChanged(newPrice: number) {
    this.selectedDatePrice = newPrice;
  }
  clearSelection() {
    this.calendarSettings.selectedDates = [];
    this.showBlockOptions = false;

    this.calendarSettings = {
      ...this.calendarSettings,
      selectedDates: []
    };

    this.cd.detectChanges();
  }


  // saveChanges() {
  //   if (
  //     this.calendarSettings.selectedDates.length === 0 ||
  //     !this.selectedPropertyId
  //   ) {
  //     return;
  //   }

  //   const selectedDates = this.calendarSettings.selectedDates.sort(
  //     (a, b) => a.getTime() - b.getTime()
  //   );

  //   const datesToUpdate: CalendarDateDTO[] = [];

  //   if (selectedDates.length === 1) {
  //     const selectedDate = selectedDates[0];
  //     const existingAvailability = this.calendarSettings.availability.find((a) =>
  //       isSameDay(a.date, selectedDate)
  //     );

  //     const price = this.availabilityMode === 'open'
  //       ? (this.fullSettings.pricing.basePrice || existingAvailability?.price || 0)
  //       : (existingAvailability?.price || 0);

  //     datesToUpdate.push({
  //       date: format(selectedDate, 'yyyy-MM-dd'),
  //       isAvailable: this.availabilityMode === 'open',
  //       price: price
  //     });
  //   }
  //   else if (selectedDates.length === 2) {
  //     const [startDate, endDate] = selectedDates;
  //     let currentDate = new Date(startDate);

  //     while (currentDate <= endDate) {
  //       const existingAvailability = this.calendarSettings.availability.find((a) =>
  //         isSameDay(a.date, currentDate)
  //       );

  //       const price = this.availabilityMode === 'open'
  //         ? this.selectedDatePrice
  //         : (existingAvailability?.price || 0);


  //       datesToUpdate.push({
  //         date: format(currentDate, 'yyyy-MM-dd'),
  //         isAvailable: this.availabilityMode === 'open',
  //         price: price
  //       });

  //       currentDate = addDays(currentDate, 1);
  //     }
  //   }

  //   this.isLoading = true;
  //   this.calendarService.updatePropertyCalendar(
  //     parseInt(this.selectedPropertyId),
  //     datesToUpdate
  //   ).pipe(
  //     finalize(() => {
  //       this.isLoading = false;
  //       this.cd.markForCheck();
  //     })
  //   ).subscribe({
  //     next: (success) => {
  //       if (success) {
  //         console.log(datesToUpdate)

  //         console.log(this.translate.instant('AVAILABILITY.SUCCESS.UPDATE'));
  //         this.updateLocalAvailability();
  //         this.clearSelection();
  //       } else {
  //         console.error('Failed to update calendar');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error updating calendar:', error);
  //     }
  //   });
  // }

  saveChanges() {
    if (
      this.calendarSettings.selectedDates.length === 0 ||
      !this.selectedPropertyId
    ) {
      return;
    }

    const selectedDates = this.calendarSettings.selectedDates.sort(
      (a, b) => a.getTime() - b.getTime()
    );

    const datesToUpdate: CalendarDateDTO[] = [];

    // Check the actual selection mode to determine how to process dates
    const selectionMode = this.calendarSettings.selectionMode || 'multiple';

    if (selectionMode === 'single') {
      // Single date selection
      const selectedDate = selectedDates[0];
      datesToUpdate.push({
        date: format(selectedDate, 'yyyy-MM-dd'),
        isAvailable: this.availabilityMode === 'open',
        price: this.selectedDatePrice
      });
    }
    else if (selectionMode === 'range' && selectedDates.length === 2) {
      // Range selection - fill all dates between start and end
      const [startDate, endDate] = selectedDates;
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        datesToUpdate.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          isAvailable: this.availabilityMode === 'open',
          price: this.selectedDatePrice
        });

        currentDate = addDays(currentDate, 1);
      }
    }
    else {
      // Multiple selection mode OR single date in range mode OR any other case
      // Process each selected date individually
      selectedDates.forEach(selectedDate => {
        datesToUpdate.push({
          date: format(selectedDate, 'yyyy-MM-dd'),
          isAvailable: this.availabilityMode === 'open',
          price: this.selectedDatePrice
        });
      });
    }

    console.log('Selection mode:', selectionMode);
    console.log('Selected dates:', selectedDates);
    console.log('Dates to update:', datesToUpdate);

    this.isLoading = true;
    this.calendarService.updatePropertyCalendar(
      parseInt(this.selectedPropertyId),
      datesToUpdate
    ).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cd.markForCheck();
      })
    ).subscribe({
      next: (success) => {
        if (success) {
          console.log('Successfully updated dates:', datesToUpdate);
          console.log(this.translate.instant('AVAILABILITY.SUCCESS.UPDATE'));
          this.updateLocalAvailability();
          this.clearSelection();
        } else {
          console.error('Failed to update calendar');
        }
      },
      error: (error) => {
        console.error('Error updating calendar:', error);
      }
    });
  }
  // private updateLocalAvailability() {
  //   const selectedDates = this.calendarSettings.selectedDates;

  //   selectedDates.forEach(selectedDate => {
  //     const existingIndex = this.calendarSettings.availability.findIndex((a) =>
  //       isSameDay(a.date, selectedDate)
  //     );

  //     if (existingIndex >= 0) {
  //       this.calendarSettings.availability[existingIndex].available =
  //         this.availabilityMode === 'open';

  //       this.calendarSettings.availability[existingIndex].price =
  //         this.availabilityMode === 'open'
  //           ? this.selectedDatePrice
  //           : this.calendarSettings.availability[existingIndex].price;
  //     }
  //   });

  //   this.calendarSettings = {
  //     ...this.calendarSettings,
  //     availability: [...this.calendarSettings.availability]
  //   };

  //   this.clearSelection();
  //   this.cd.detectChanges();
  // }

  private updateLocalAvailability() {
    const selectedDates = this.calendarSettings.selectedDates;

    if (selectedDates.length === 0) return;

    let datesToUpdate: Date[] = [];
    const selectionMode = this.calendarSettings.selectionMode || 'multiple';

    if (selectionMode === 'single') {
      // Single date selection
      datesToUpdate = [selectedDates[0]];
    }
    else if (selectionMode === 'range' && selectedDates.length === 2) {
      // Range selection - generate all dates between start and end
      const [startDate, endDate] = selectedDates.sort((a, b) => a.getTime() - b.getTime());
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        datesToUpdate.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }
    }
    else {
      // Multiple selection OR single date in range mode OR any other case
      datesToUpdate = [...selectedDates];
    }

    console.log('Updating local availability for dates:', datesToUpdate);

    // Update availability for all dates
    datesToUpdate.forEach(dateToUpdate => {
      const existingIndex = this.calendarSettings.availability.findIndex((a) =>
        isSameDay(a.date, dateToUpdate)
      );

      if (existingIndex >= 0) {
        // Update existing availability
        this.calendarSettings.availability[existingIndex].available =
          this.availabilityMode === 'open';
        this.calendarSettings.availability[existingIndex].price = this.selectedDatePrice;
      } else {
        // Add new availability entry if it doesn't exist
        this.calendarSettings.availability.push({
          date: dateToUpdate,
          available: this.availabilityMode === 'open',
          price: this.selectedDatePrice,
          isBooked: false
        });
      }
    });

    // Update the calendar settings
    this.calendarSettings = {
      ...this.calendarSettings,
      availability: [...this.calendarSettings.availability]
    };

    this.cd.detectChanges();
  }

}
