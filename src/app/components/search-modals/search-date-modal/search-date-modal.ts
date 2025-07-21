import { Component } from '@angular/core';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-date-modal',
  templateUrl: './search-date-modal.html',
  styleUrls: ['./search-date-modal.css','../../search-filter-group/search-filter-group.css','../../header/header.css'],
  imports: [FormsModule, NgxDaterangepickerMd, TranslateModule]
})
export class SearchDateModal {

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

  datesUpdated(range: any) {
    this.selectedDateRange = range;
  }

  selectQuickDate(type: 'today' | 'tomorrow' | 'thisWeekend') {
    const today = moment();
    switch (type) {
      case 'today':
        this.selectedDateRange = { startDate: today, endDate: today };
        break;
      case 'tomorrow':
        const t = today.clone().add(1, 'day');
        this.selectedDateRange = { startDate: t, endDate: t };
        break;
      case 'thisWeekend':
        const friday = moment().isoWeekday(5);
        const saturday = moment().isoWeekday(6);
        this.selectedDateRange = { startDate: friday, endDate: saturday };
        break;
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
