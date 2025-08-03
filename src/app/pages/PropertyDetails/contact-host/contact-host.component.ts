import { Property } from './../../../core/models/Property';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HostProfile, HostprofileService } from '../../../core/services/hostProfile/hostprofile-service';
import { CalendarAvailabilityDto, CalendarAvailabilityService } from '../../../core/services/CalendarAvailability/calendar-availability.service';
import { ReverseSectionComponent } from "../reverse-section/reverse-section.component";
import { range } from '../BookingCalendar/BookingCalendar.component';

@Component({
  selector: 'app-contact-host',
  imports: [FormsModule, CommonModule, ReverseSectionComponent],
  templateUrl: './contact-host.component.html',
   styleUrls: ['./contact-host.component.css']
})

export class ContactHostComponent implements OnInit {

  
  firstCalendarDate = dayjs().add(-5, 'months')
  lastCalendarDate = dayjs().add(1, 'year')
  availability!: CalendarAvailabilityDto[]
  dateMap?: Map<string, CalendarAvailabilityDto>

  hostId!: string;
  checkIn!: string;
  checkOut!: string;
  startDate = dayjs()
  endDate = dayjs()
  guests!: number;
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
      private cdr: ChangeDetectorRef
    ) {}

 ngOnInit(): void {
   this.route.paramMap.subscribe(params => {
    this.propertyId = +params.get('propertyId')!;
    this.hostId = params.get('hostId')!;
    this.checkIn = params.get('checkIn')!;
    this.checkOut = params.get('checkOut')!;
    this.guests = +params.get('guests')!;
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

}
