import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DaterangepickerComponent, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CalendarAvailabilityDto, CalendarAvailabilityService } from '../../../core/services/CalendarAvailability/calendar-availability.service';
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
import moment from 'moment';
import { CommonPropInfoService } from '../../property-info/common-prop-info-service';
import { CommonModule } from '@angular/common';

dayjs.extend(localeData);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export type range   = {startDate:any, endDate:any}

@Component({
  selector: 'app-BookingCalendar',
  standalone: true,
  imports: [NgxDaterangepickerMd, FormsModule,CommonModule],
  templateUrl: './BookingCalendar.component.html',
  styleUrls: ['./BookingCalendar.component.css']
})
export class BookingCalendarComponent implements OnInit {

  constructor(
      private calendarService: CalendarAvailabilityService,
      private property: PropertyService,
      private http: HttpClient,
      private cdr: ChangeDetectorRef,
      private commonService: CommonPropInfoService
    ) { }

  @Input() propertyId!: number;
  @Input() checkIn?: dayjs.Dayjs
  @Input() checkOut?: dayjs.Dayjs
  @Output() dateSelected = new EventEmitter<{ start: string; end: string }>();
  @Output() datedChange = new EventEmitter<range>()
  @Input() dateMap?: Map<string,CalendarAvailabilityDto>
  
  @ViewChild("picker") picker!: DaterangepickerComponent;
  
  showPicker = true;
  clickedDate?:dayjs.Dayjs
  firstUnavailableDate?:dayjs.Dayjs
  selected: { startDate?: dayjs.Dayjs, endDate?: dayjs.Dayjs }= {startDate:undefined,endDate:undefined};
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month')
    ]
  };

  locale = {
    format: 'YYYY-MM-DD',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    customRangeLabel: 'Custom'
  };

  selectedDateRange = {
    startDate: dayjs() ,
    endDate:  dayjs() 

  };

  totalPrice!: number;



  munavailableDates: string[] = [];
  // minDate = dayjs().format('YYYY-MM-DD');

  //  locale = {
  //   format: 'MMM DD',
  //   separator: ' - ',
  //   applyLabel: 'Apply',
  //   cancelLabel: 'Cancel',
  //   daysOfWeek: dayjs.weekdaysMin().map(d => d.toUpperCase()),
  //   monthNames: dayjs.monthsShort().map(m => m.toUpperCase()),
  //   firstDay: 0
  // };


  ngOnInit(): void {
    this.commonService.clear$.subscribe(()=>this.clear())
    this.selectedDateRange = { startDate: dayjs(), endDate: dayjs() };
    // console.log('enter oninit of booking service rawan ')
    // this.fetchUnavailableDates();
    // console.log("finish");
    // this.selected={
    //   startDate : dayjs(),
    //   endDate: dayjs()
    // }
  }

   ngOnChanges(changes: SimpleChanges): void {
    // console.log("onChanges From BookingCalendar",changes)
    let x = {startDate:undefined,endDate:undefined}
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",x)
      if (changes['checkIn']) {
        // console.log('checkIn input changed:', this.checkIn);
        if(this.selected)
        x.startDate = changes['checkIn'].currentValue
      }
      if (changes['checkOut']) {
        if(this.selected)
        x.endDate = changes['checkOut'].currentValue
        
        // console.log('checkOut input changed:', this.checkOut);
      }
      this.selected= x
      
      // this.picker.choosedDate.emit({
        
      //           startDate:dayjs(this.selected.startDate.toDate()),
      //           endDate:dayjs(this.selected.startDate.toDate()),
      //           chosenLabel:"dhsga"
      //         })
      
      // console.log(this.picker)
      // console.log(this.selected?.startDate
      // console.log(this.selected?.endDate)
      // this.picker.setStartDate(this.selected.startDate)
      // this.picker.setEndDate(this.selected?.endDate)
      if(this.picker){
        if(this.selected.startDate)
          this.picker.startDate = this.selected?.startDate
        if(this.selected.endDate)
              this.picker.endDate = this.selected?.endDate
        this.picker.updateView()
        this.picker.updateCalendars()
        this.picker.hide()
      }
  }
  onClear(){
    this.clear()
    this.commonService.clear()
    
  }
  clear(){
    console.log("clear")
    this.selected = {
      endDate :undefined,
      startDate: undefined 
    }         
    // this.picker.
    this.picker.clear()
    this.cdr.detectChanges()
    this.datedChange.emit({startDate:this.selected.startDate,endDate:this.selected.startDate})
  }


  isInvalidDate = (date: dayjs.Dayjs): boolean => {
      // // console.log("selected start date is ", this.selected.startDate)
      // if(this.clickedDate ){
      //   if(date.isBefore(this.clickedDate))
      //     return true
      //   if(!this.firstUnavailableDate)
      //     return false
      //   if(date.isBefore(this.firstUnavailableDate))
      //     return false
      //   return true
      // }
  
      if(date.isBefore(dayjs()))
        return true
      if(this.dateMap)
      {
        // if( !(this.dateMap.get(date.toString())?.isAvailable?? true))
          // console.log(date, (this.dateMap.get(date.toISOString().slice(0,19))?.isAvailable))
        return  !(this.dateMap.get(date.toISOString().slice(0,19))?.isAvailable?? true)
      }
      // .some(d => dayjs(d.date).isSame(date, 'day') && d.isAvailable )
      return false
      
    }

    onStartDateChange(clickedDate:any){
        
        this.clickedDate = clickedDate?.startDate?? undefined
        if(this.clickedDate)
        {
          let date ;
          for(let i=1;  this.dateMap && i < this.dateMap.size  ;i++)
          {
            date =  this.dateMap?.get( dayjs(this.clickedDate)
                                            .add(i,"day")
                                            .toISOString().slice(0,19)
                                  ) 
    
            if(date && !date.isAvailable){
                this.firstUnavailableDate = dayjs(date.date)
                console.log("firstUnavailableDate",this.firstUnavailableDate)
                break;
            }
          }
        }else
          this.firstUnavailableDate = undefined
      }
  // selectPropertyName_price(propertyId: number): Observable<{ title: string; pricePerNight: number }> {
  //   const url = `${this.property}/${propertyId}`;
  //   return this.http.get<Result<Property>>(url).pipe(
  //     map(response => {
  //       const property = response.data;
  //       return {
  //         title: property.title,
  //         pricePerNight: property.pricePerNight
  //       };
  //     })
  //   );
  // }

  onDateRangeSelected(range: { startDate: any, endDate: any }) {
    // this.selected = range;

    this.selected = {
      endDate: range?.endDate,
      startDate: range?.startDate
    }

    // console.log("range", range)
  }
  onDatesChanged(range: range ) {
    
  // console.log(range)
  // console.log('Start:', range.startDate.format('YYYY-MM-DD'));
  // console.log('End:', range.endDate.format('YYYY-MM-DD'));

  // this.selected = {
  //   startDate: moment(range?.startDate?.toDate()),
  //   endDate: moment(range?.endDate?.toDate()),
  // }
  this.datedChange.emit(range)

}

  // fetchUnavailableDates(): void {
  //   const start = dayjs().startOf('month').format('YYYY-MM-DD');
  //   const end = dayjs().add(3, 'month').endOf('month').format('YYYY-MM-DD');

  //   this.calendarService.reverseIThink(this.propertyId, start, end).subscribe(res => {
  //       console.log(this.calendarService);
  //     console.log(this.propertyId, this.selectedDateRange ,"first date ",start ,"lastdate rawan ", end)
  //     if (res.isSuccess && res.data.unavailableDates) {
  //       this.munavailableDates = res.data.unavailableDates;
  //       console.log(res)
  //     }
  //   }
  // );
  // }

  datesUpdated(range: any): void {
    const start = moment(range.startDate).format('YYYY-MM-DD');
    const end = moment(range.endDate).format('YYYY-MM-DD');

    // console.log('User selected range:', { start, end });

    // Check if any selected date is unavailable
    const anyUnavailable = this.munavailableDates.some(date =>
      moment(date).isSameOrAfter(start) && moment(date).isSameOrBefore(end)


    );
    if (anyUnavailable) {
      console.warn('Selected range includes unavailable dates!');
      // Optional: Reset selection or show error
      this.clearDates();
      alert('Some of the selected dates are unavailable. Please select different dates.');
      return;
    }

    // this.selectedDateRange = { startDate: start, endDate: end };
    this.dateSelected.emit({ start, end });    //emit that to
  }

  clearDates(): void {
    this.selectedDateRange = { startDate: dayjs(), endDate: dayjs() };

  }

  




}