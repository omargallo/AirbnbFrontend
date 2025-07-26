import { Property } from './../../core/models/Property';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PropertyService } from '../../core/services/Property/property.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Routes } from '@angular/router';
import { PropertImageGalaryComponent } from "../PropertyDetails/propertImage-galary/propertImage-galary.component";
import { ReverseSectionComponent } from "../PropertyDetails/reverse-section/reverse-section.component";
import { AmenitiesSectionComponent } from '../PropertyDetails/amenities-section/amenities-section.component';
import { BookingCalendarComponent } from "../PropertyDetails/BookingCalendar/BookingCalendar.component";
import { MapLocationComponent } from "../PropertyDetails/mapLocation/mapLocation.component";
import { GuestReviews } from "../../components/guest-reviews/guest-reviews";

@Component({
  selector: 'app-property-info',
  imports: [CommonModule, PropertImageGalaryComponent, ReverseSectionComponent, AmenitiesSectionComponent, BookingCalendarComponent, MapLocationComponent, GuestReviews],
  templateUrl: './property-info.html',
  styleUrl: './property-info.css'
})


export class PropertyInfo implements OnInit {
  // properties: Property[] = [];
  selectedProperty: Property | null = null;
  isLoading = true;
  error: string | null = null;


//to link reverse with calender 
    propertyId!: number;
    selectedDates = { start: '', end: '' };
    guestCount = {
      adults: 1,
      children: 0,
      infants: 0
  }




    @Input() checkIn!: string;
    @Input() checkOut!: string;
    @Input() guests!: { adults: number, children: number, infants: number };

      @Output() guestChange = new EventEmitter<{
        adults: number;
        children: number;
        infants: number;
      }>();


  // State for child components
  activeTab: 'gallery' | 'reviews' | 'amenities' = 'gallery';
  property: any;

  constructor(private propertyService: PropertyService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.propertyId = +params['propertyId']; // Get propertyId from route params
      if(this.propertyId <= 0) {
        this.error = 'Invalid property ID';
        this.isLoading = false;
        return;
      }
      console.log('Property ID from route:', this.propertyId);
      this.showPropertyDetails(this.propertyId);
    });
  }



  showPropertyDetails(id: number): void {
    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.selectedProperty = property;
        console.log('Selected property:', this.selectedProperty);
        console.log(id);

      },
      error: (err) => {
        this.error = 'Failed to load property details';
        console.error(err);
      }
    });
  }


   changeTab(tab: 'gallery' | 'reviews' | 'amenities'): void {
    this.activeTab = tab;
  }


onGuestUpdate(type: 'adults' | 'children' | 'infants', delta: number) {
  this.guests[type] += delta;
  this.guestChange.emit(this.guests);
}



 onDateSelected(range: { start: string; end: string }) {
    this.selectedDates = {
      start: range.start,
      end: range.end
    };
  }

  // Handle guest update from Reverse Section
  onGuestChange(updatedGuests: { adults: number; children: number; infants: number }) {
    this.guestCount = updatedGuests;
  }

}