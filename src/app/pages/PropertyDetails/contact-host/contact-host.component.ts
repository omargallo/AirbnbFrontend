import { Property } from './../../../core/models/Property';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HostProfile, HostprofileService } from '../../../core/services/hostProfile/hostprofile-service';
import { CalendarAvailabilityDto, CalendarAvailabilityService } from '../../../core/services/CalendarAvailability/calendar-availability.service';
import { ReverseSectionComponent } from "../reverse-section/reverse-section.component";
import { range } from '../BookingCalendar/BookingCalendar.component';
import { ChatService, ReservePropertyRequest, ReserveRequestIntProeprtyId } from '../../../core/services/Message/message.service';

import utc from 'dayjs/plugin/utc';
import { ConfirmService } from '../../../core/services/confirm.service';


@Component({
  selector: 'app-contact-host',
  imports: [FormsModule, CommonModule, ReverseSectionComponent],
  templateUrl: './contact-host.component.html',
   styleUrls: ['./contact-host.component.css']
})

export class ContactHostComponent implements OnInit {
  message:string = "";
  isFirstTime=true;
  isRequestLoading=false;

  firstCalendarDate = dayjs().add(-5, 'months')
  lastCalendarDate = dayjs().add(1, 'year')
  availability!: CalendarAvailabilityDto[]
  dateMap?: Map<string, CalendarAvailabilityDto>

  hostId!: string;
  checkIn!: string;
  checkOut!: string;
  startDate = dayjs()
  endDate = dayjs()
  guests: number = 1;
  adults!: number;
  children!: number;
  infants!: number;
  showReservationBox: boolean = true;
  propertyId!:number;
  hostProfile!: HostProfile;


  constructor(  
      private route: ActivatedRoute,
      private hostProfileService: HostprofileService,
      private calendarService: CalendarAvailabilityService,
      private cdr: ChangeDetectorRef,
      private messageService: ChatService,
      private confirm: ConfirmService,
      private router: Router
    ) {}

 ngOnInit(): void {
   this.route.paramMap.subscribe(params => {
    this.propertyId = +params.get('propertyId')!;
    this.hostId = params.get('hostId')!;
    this.checkIn = params.get('checkIn')!;
    this.checkOut = params.get('checkOut')!;
    this.guests = +params.get('guests')! >0? +params.get("guests")! :1;
    this.children = +params.get('children')!;

    if(this.checkIn)
      this.startDate =dayjs(this.checkIn)
    if(this.checkOut)
      this.endDate =dayjs(this.checkOut)
  });

  this.route.queryParamMap.subscribe(query => {
    // this.checkIn = query.get('check_in');
    // this.checkOut = query.get('check_out');
    // this.guests = query.get('guests');
    // this.totalPrice = query.get('total_price');
    // others like adults, children, infants if needed
  });

  // Get host info (name, image)
  this.hostProfileService.getHostProfile(this.hostId).subscribe(host => {
    this.hostProfile.firstName = this.getHostProfile.name;
    // this.hostProfile.lastName=
  });
  
    this.getCalendarAvailability()
  }

getHostProfile(hostId: string) {
  this.hostProfileService.getHostProfile(hostId).subscribe({
    next: (profile) => {
      this.hostProfile = profile;
      console.log('Host profile loaded:', profile);
    },
    error: (err) => {
      console.error('Error fetching host profile:', err);
    }
  });
}


  getCalendarAvailability() {
      this.calendarService.getAvailability(
        this.propertyId,
        this.firstCalendarDate.toString(),
        this.lastCalendarDate.toString()
      ).subscribe({
        next: (res) => {
          console.log("getCalendarAvailability", res)
          console.log("date.toString", dayjs().toISOString())
          this.availability = res;
          const dateMap = new Map<string, CalendarAvailabilityDto>();

          res.forEach(item => {
            // dateMap.set(item.date.slice(0, 19), item);
            const dateOnly = dayjs(item.date).format('YYYY-MM-DD');
            dateMap.set(dateOnly, item);
          });
          console.log(dateMap)
          this.dateMap = dateMap;
          this.cdr.detectChanges()
        },
        error: () => { }
      })

    }

  onGuestChange(updatedGuests: { adults: number; children: number }) {
    this.guests = updatedGuests.adults;
    this.children = updatedGuests.children
  }

  onDateChange(range: range) {
    // console.log("from the parent's onDateChange", range)
    this.endDate = range.endDate //moment(range?.startDate?.toDate())
    this.startDate = range.startDate //moment(range?.endDate?.toDate())

    // this.cdr.detectChanges()

  }

  onSendMessage(){
    if(this.message.length<1 || !this.endDate || !this.startDate )
      return
    let request: ReserveRequestIntProeprtyId ={
      propertyId: this.propertyId,
      checkInDate: this.startDate.startOf('day').utc().toISOString(),
      checkOutDate: this.endDate.startOf('day').utc().toISOString(),
      guestCount: this.guests,
      message: this.message
    } 
    console.log(request)
    
    this.isRequestLoading = true
    this.messageService
        .reserveIntPropertyId(request)
        .subscribe({
          next:(res)=>{
            this.isRequestLoading = false
            if(res.isSuccess)
            {
              this.confirm.success(res.message,"Go to message to see your request",()=>{this.router.navigateByUrl("/Messages")})
            }
          },
          error:(res)=>{
            this.isRequestLoading = false
            console.log(res)
            this.confirm.fail(res.message,"")
          }
        })
  }

  isEmptyMessage(){
    console.log("isemptyMessage")
    let isEmpty = this.message.length < 1 && !this.isFirstTime
    // this.isFirstTime = false
    return isEmpty 
  }
  onModelChange(){
    this.isFirstTime = false
  }
}
