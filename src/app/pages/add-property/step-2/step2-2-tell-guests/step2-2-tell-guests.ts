import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step2-2-tell-guests',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step2-2-tell-guests.html',
  styleUrl: './step2-2-tell-guests.css'
})
export class Step22TellGuests {
  // Amenity categories
  guestFavorites: string[] = [
    'Wifi',
    'TV',
    'Kitchen',
    'Washer',
    'Free parking on premises'
  ];

  standoutAmenities: string[] = [
    'Pool',
    'Hot tub',
    'Patio'
  ];

  safetyItems: string[] = [
    'Smoke alarm',
    'First aid kit',
    'Fire extinguisher'
  ];

  // Selected amenities
  selectedAmenities: Set<string> = new Set();

  // Method to toggle amenity selection
  toggleAmenity(amenity: string): void {
    if (this.selectedAmenities.has(amenity)) {
      this.selectedAmenities.delete(amenity);
    } else {
      this.selectedAmenities.add(amenity);
    }
  }

  // Method to check if amenity is selected
  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.has(amenity);
  }
}
