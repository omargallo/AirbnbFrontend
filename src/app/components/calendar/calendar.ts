import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  startOfDay
} from 'date-fns';

export interface DayAvailability {
  date: Date;
  available: boolean;
  price: number;
  originalPrice?: number;
}

export interface CalendarSettings {
  viewType: 'month' | 'year';
  selectedDates: Date[];
  availability: DayAvailability[];
  minNights: number;
  maxNights: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class CalendarComponent implements OnInit {
  @Input() settings: CalendarSettings = {
    viewType: 'year',
    selectedDates: [],
    availability: [],
    minNights: 1,
    maxNights: 365
  };

  @Output() dateSelected = new EventEmitter<Date[]>();
  @Output() settingsChanged = new EventEmitter<CalendarSettings>();

  currentYear = new Date().getFullYear();
  currentMonth = new Date();
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  yearMonths: Date[] = [];
  showViewDropdown = false;
  tempViewType: 'month' | 'year' = 'year';

  ngOnInit() {
    this.generateYearMonths();
    this.tempViewType = this.settings.viewType;
  }

  generateYearMonths() {
    this.yearMonths = [];
    for (let i = 0; i < 12; i++) {
      this.yearMonths.push(new Date(this.currentYear, i, 1));
    }
  }

  // getMonthDays(monthDate: Date) {
  //   const start = startOfWeek(startOfMonth(monthDate));
  //   const end = endOfWeek(endOfMonth(monthDate));

  //   return eachDayOfInterval({ start, end }).map(date => ({
  //     date,
  //     inCurrentMonth: isSameMonth(date, monthDate)
  //   }));
  // }

  monthDaysMap: Map<string, { date: Date, inCurrentMonth: boolean }[]> = new Map();

  getMonthDays(monthDate: Date) {
    const key = format(monthDate, 'yyyy-MM');
    if (this.monthDaysMap.has(key)) {
      return this.monthDaysMap.get(key)!;
    }

    const start = startOfWeek(startOfMonth(monthDate));
    const end = endOfWeek(endOfMonth(monthDate));

    const days = eachDayOfInterval({ start, end }).map(date => ({
      date,
      inCurrentMonth: isSameMonth(date, monthDate),
    }));

    this.monthDaysMap.set(key, days);
    return days;
  }

  isDisabled(date: Date): boolean {
    const today = startOfDay(new Date());
    return isBefore(date, today);
  }

  isAvailable(date: Date): boolean {
    if (this.isDisabled(date)) return false;
    const availability = this.settings.availability.find(a =>
      isSameDay(a.date, date)
    );
    return availability ? availability.available : true;
  }

  isSelected(date: Date): boolean {
    return this.settings.selectedDates.some(selectedDate =>
      isSameDay(selectedDate, date)
    );
  }

  isHighlighted(date: Date): boolean {
    if (this.settings.selectedDates.length !== 2) return false;
    const [start, end] = this.settings.selectedDates.sort((a, b) => a.getTime() - b.getTime());
    return isAfter(date, start) && isBefore(date, end);
  }

  getPrice(date: Date): number | null {
    const availability = this.settings.availability.find(a =>
      isSameDay(a.date, date)
    );
    return availability ? availability.price : null;
  }

  hasDiscount(monthDate: Date): boolean {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    return this.settings.availability.some(a =>
      a.date >= monthStart &&
      a.date <= monthEnd &&
      a.originalPrice &&
      a.price < a.originalPrice
    );
  }

  // selectDate(date: Date) {
  //   if (this.isDisabled(date) || !this.isAvailable(date)) return;

  //   let newSelectedDates = [...this.settings.selectedDates];

  //   if (newSelectedDates.length === 0) {
  //     newSelectedDates = [date];
  //   } else if (newSelectedDates.length === 1) {
  //     if (isSameDay(newSelectedDates[0], date)) {
  //       newSelectedDates = [];
  //     } else {
  //       newSelectedDates.push(date);
  //       newSelectedDates.sort((a, b) => a.getTime() - b.getTime());
  //     }
  //   } else {
  //     newSelectedDates = [date];
  //   }

  //   this.settings.selectedDates = newSelectedDates;
  //   this.dateSelected.emit(newSelectedDates);
  //   this.settingsChanged.emit(this.settings);
  // }


  selectDate(date: Date) {
    if (this.isDisabled(date) || !this.isAvailable(date)) return;

    const index = this.settings.selectedDates.findIndex(d => isSameDay(d, date));

    if (index > -1) {
      this.settings.selectedDates.splice(index, 1);
    } else {
      this.settings.selectedDates.push(date);
    }

    this.settings = { ...this.settings, selectedDates: [...this.settings.selectedDates] };

    this.dateSelected.emit(this.settings.selectedDates);
    this.settingsChanged.emit(this.settings);
  }

  toggleViewType() {
    this.showViewDropdown = !this.showViewDropdown;
  }

  setViewType(type: 'month' | 'year') {
    this.tempViewType = type;
  }

  closeViewDropdown() {
    this.showViewDropdown = false;
    // this.tempViewType = this.settings.viewType;
  }

  applyViewType() {
    this.settings.viewType = this.tempViewType;
    this.showViewDropdown = false;
    this.settingsChanged.emit(this.settings);
  }

  previousMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
  }

  // Helper methods for template
  format = format;
  isSameMonth = isSameMonth;

  trackByDate(index: number, day: { date: Date }) {
    return day.date.toDateString();
  }

}