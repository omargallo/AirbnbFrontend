import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CalendarAvailabilityService } from '../../../core/services/CalendarAvailability/calendar-availability.service';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/en'; // or your desired locale
import 'dayjs/locale/en';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { PropertyService } from '../../../core/services/Property/property.service';
import { map, Observable } from 'rxjs';
import { Result } from '../../../core/services/Wishlist/wishlist.service';
import { Property } from '../../../core/models/Property';
import { HttpRequest } from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';

dayjs.extend(localeData);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


@Component({
  selector: 'app-BookingCalendar',
  standalone: true,
  imports: [NgxDaterangepickerMd, FormsModule],
  templateUrl: './BookingCalendar.component.html',
  styleUrls: ['./BookingCalendar.component.css']
})
export class BookingCalendarComponent implements OnInit {
  
  constructor(private calendarService: CalendarAvailabilityService , private property :PropertyService,private http:HttpClient) {}

    @Input() propertyId!: number;
    @Output() dateSelected = new EventEmitter<{ start: string; end: string }>();


  selectedDateRange = {
    startDate: null as string | null,
    endDate: null as string | null

  };

 totalPrice!: number;



    munavailableDates: string[] = [];
      minDate = dayjs().format('YYYY-MM-DD');

   locale = {
    format: 'MMM DD',
    separator: ' - ',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    daysOfWeek: dayjs.weekdaysMin().map(d => d.toUpperCase()),
    monthNames: dayjs.monthsShort().map(m => m.toUpperCase()),
    firstDay: 0
  };


  ngOnInit(): void {
    this.selectedDateRange = { startDate: null, endDate: null };
    console.log('enter oninit of booking service rawan ' )
    this.fetchUnavailableDates();
    console.log("finish");
  }

 selectPropertyName_price(propertyId: number): Observable<{ title: string; pricePerNight: number }> {
  const url = `${this.property}/${propertyId}`;
  return this.http.get<Result<Property>>(url).pipe(
    map(response => {
      const property = response.data;
      return {
        title: property.title,
        pricePerNight: property.pricePerNight
      };
    })
  );
}


  fetchUnavailableDates(): void {
    const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const end = dayjs().add(3, 'month').endOf('month').format('YYYY-MM-DD');

    this.calendarService.reverseIThink(this.propertyId, start, end).subscribe(res => {
        console.log(this.calendarService);
      console.log(this.propertyId, this.selectedDateRange ,"first date ",start ,"lastdate rawan ", end)
      if (res.isSuccess && res.data.unavailableDates) {
        this.munavailableDates = res.data.unavailableDates;
        console.log(res)
      }
    }
  );
  }

  datesUpdated(range: any): void {
    const start = dayjs(range.startDate).format('YYYY-MM-DD');
    const end = dayjs(range.endDate).format('YYYY-MM-DD');

      console.log('User selected range:', { start, end });

      // Check if any selected date is unavailable
        const anyUnavailable = this.munavailableDates.some(date => 
        dayjs(date).isSameOrAfter(start) && dayjs(date).isSameOrBefore(end)

        
  );
    if (anyUnavailable) {
    console.warn('Selected range includes unavailable dates!');
    // Optional: Reset selection or show error
    this.clearDates();
    alert('Some of the selected dates are unavailable. Please select different dates.');
    return;
  }

    this.selectedDateRange = { startDate: start, endDate: end };
    this.dateSelected.emit({ start, end });    //emit that to
  }

  clearDates(): void {
    this.selectedDateRange = { startDate: null, endDate: null };
    
  }

  isInvalidDate = (d: Dayjs): boolean => {
    return this.munavailableDates.includes(d.format('YYYY-MM-DD'));
  };



 
}