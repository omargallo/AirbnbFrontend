import { Component, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-date-modal',
  templateUrl: './search-date-modal.html',
  styleUrls: ['./search-date-modal.css', '../../search-filter-group/search-filter-group.css', '../../header/header.css'],
  imports: [FormsModule, NgxDaterangepickerMd, TranslateModule, CommonModule]
})
export class SearchDateModal {
  activeQuickOption: 'today' | 'tomorrow' | 'thisWeekend' | null = null;

  ranges: any = {
    Today: [moment(), moment()],
    Tomorrow: [moment().add(1, 'days'), moment().add(1, 'days')],
    'This weekend': [moment().isoWeekday(5), moment().isoWeekday(7)],
    'Next week': [
      moment().add(1, 'week').startOf('isoWeek'),
      moment().add(1, 'week').endOf('isoWeek'),
    ],
    'Next month': [
      moment().add(1, 'month').startOf('month'),
      moment().add(1, 'month').endOf('month'),
    ],
  };
  selectedDateRange = {
    startDate: null as moment.Moment | null,
    endDate: null as moment.Moment | null
  };



  locale = {
    format: 'MMM DD, YYYY',
    separator: ' - ',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
    customRangeLabel: 'Custom Range',
    weekLabel: 'W',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek(),
  };
  @Output() dateSelected = new EventEmitter<string | { start: string; end: string }>();

  datesUpdated(range: any) {
    this.activeQuickOption = null; // clear quick option
    this.selectedDateRange = range;
    this.emitDate();
  }


  selectQuickDate(type: 'today' | 'tomorrow' | 'thisWeekend') {
    if (this.activeQuickOption === type) {
      // Toggle off
      this.activeQuickOption = null;
      this.selectedDateRange = { startDate: null, endDate: null };
      console.log('❌ Quick option cleared');
      return;
    }

    this.activeQuickOption = type;

    const today = moment();

    switch (type) {
      case 'today':
        this.selectedDateRange = { startDate: today, endDate: today };
        break;
      case 'tomorrow':
        const tomorrow = today.clone().add(1, 'day');
        this.selectedDateRange = { startDate: tomorrow, endDate: tomorrow };
        break;
      case 'thisWeekend':
        const friday = moment().isoWeekday(5);
        const saturday = moment().isoWeekday(6);
        this.selectedDateRange = { startDate: friday, endDate: saturday };
        break;
    }

    this.emitDate();
  }

  private emitDate() {
    const { startDate, endDate } = this.selectedDateRange;

    if (startDate && endDate) {
      const start = startDate.local().format('YYYY-MM-DD');
      let end = endDate.local().format('YYYY-MM-DD');

      const isQuick = this.activeQuickOption !== null;

      if (!isQuick && start !== end) {
        end = endDate.clone().add(-1, 'day').local().format('YYYY-MM-DD');
      }

      if (start === end) {
        console.log('📅 Selected Single Date:', start);
        this.dateSelected.emit(start);
      } else {
        console.log('📅 Selected Start:', start);
        console.log('📅 Selected End:', end);
        this.dateSelected.emit({ start, end });
      }
    }
  }




  getTodayFormatted(): string {
    return moment().format('MMM DD');
  }

  getTomorrowFormatted(): string {
    return moment().add(1, 'day').format('MMM DD');
  }

  getFridayDate(): string {
    return moment().isoWeekday(5).format('MMM DD');
  }

  getSaturdayDate(): string {
    return moment().isoWeekday(6).format('MMM DD');
  }


}
