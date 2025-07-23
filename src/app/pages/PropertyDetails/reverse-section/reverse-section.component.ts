import { CommonModule } from '@angular/common';
import { Property } from './../../../core/models/Property';
import { PropertyService } from './../../../core/services/Property/property.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/Booking/booking.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reverse-section',
  imports: [CommonModule,FormsModule ],
  templateUrl: './reverse-section.component.html',
  styleUrls: ['./reverse-section.component.css']
})
export class ReverseSectionComponent implements OnInit {

   checkInDate: string = '';
  checkOutDate: string = '';
  guestCount: number = 1;
  pricePerNight: number = 120;

  isSticky = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isSticky = window.scrollY > 300;
  }

  @Input() propertyId!: number ;
  property: any;

  constructor(private propertyService: PropertyService,private bookng :BookingService) {
   }

  ngOnInit() {
    if (!this.propertyId) {
      console.error('Property ID is required for ReverseSectionComponent');
      return;
    }

    
  }
  



 

}
