import { Component } from '@angular/core';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step1-5-basic-about',
  imports: [FooterComponent],
  templateUrl: './step1-5-basic-about.html',
  styleUrl: './step1-5-basic-about.css'
})
export class Step15BasicAbout {
  // Counter values
  guests: number = 4;
  bedrooms: number = 1;
  beds: number = 1;
  bathrooms: number = 1;

  // Minimum values
  minGuests: number = 1;
  minBedrooms: number = 0;
  minBeds: number = 1;
  minBathrooms: number = 1;

  // Counter methods
  increaseCounter(type: 'guests' | 'bedrooms' | 'beds' | 'bathrooms'): void {
    switch (type) {
      case 'guests':
        this.guests++;
        break;
      case 'bedrooms':
        this.bedrooms++;
        break;
      case 'beds':
        this.beds++;
        break;
      case 'bathrooms':
        this.bathrooms++;
        break;
    }
  }

  decreaseCounter(type: 'guests' | 'bedrooms' | 'beds' | 'bathrooms'): void {
    switch (type) {
      case 'guests':
        if (this.guests > this.minGuests) this.guests--;
        break;
      case 'bedrooms':
        if (this.bedrooms > this.minBedrooms) this.bedrooms--;
        break;
      case 'beds':
        if (this.beds > this.minBeds) this.beds--;
        break;
      case 'bathrooms':
        if (this.bathrooms > this.minBathrooms) this.bathrooms--;
        break;
    }
  }
}
