import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step1-4-2-confirm-address',
  imports: [FormsModule,FooterComponent],
  templateUrl: './step1-4-2-confirm-address.html',
  styleUrl: './step1-4-2-confirm-address.css'
})
export class Step142ConfirmAddress {
  // Address fields
  country: string = 'EG';
  street: string = '';
  apt: string = '';
  city: string = 'Cairo';
  state: string = 'Cairo Governorate';
  zipcode: string = '';

  // Location preference toggle
  showSpecificLocation: boolean = false;

  // Methods to handle input changes
  onCountryChange(newCountry: string): void {
    this.country = newCountry;
  }
  onStreetChange(newStreet: string): void {
    this.street = newStreet;
  }
  onAptChange(newApt: string): void {
    this.apt = newApt;
  }
  onCityChange(newCity: string): void {
    this.city = newCity;
  }
  onStateChange(newState: string): void {
    this.state = newState;
  }
  onZipcodeChange(newZipcode: string): void {
    this.zipcode = newZipcode;
  }
  onLocationPreferenceChange(value: boolean): void {
    this.showSpecificLocation = value;
  }
}
