import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyFormStorageService } from '../../../../core/services/ListingWizard/property-form-storage.service';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step1-4-2-confirm-address',
  imports: [FormsModule],
  templateUrl: './step1-4-2-confirm-address.html',
  styleUrl: './step1-4-2-confirm-address.css'
})
export class Step142ConfirmAddress implements OnInit, OnDestroy {
  private subscription!: Subscription;
  // Address fields
  country: string = '';
  street: string = '';
  apt: string = '';
  city: string = '';
  state: string = '';
  zipcode: string = '';

  // Location preference toggle
  showSpecificLocation: boolean = false;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService
  ) {}

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step1-4-2');
    if (savedData) {
      this.country = savedData.country || this.country;
      this.street = savedData.street || this.street;
      this.apt = savedData.apt || this.apt;
      this.city = savedData.city || this.city;
      this.state = savedData.state || this.state;
      this.zipcode = savedData.zipcode || this.zipcode;
      this.showSpecificLocation = savedData.showSpecificLocation || this.showSpecificLocation;
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private saveFormData(): void {
    this.formStorage.saveFormData('step1-4-2', {
      country: this.country,
      street: this.street,
      apt: this.apt,
      city: this.city,
      state: this.state,
      zipcode: this.zipcode,
      showSpecificLocation: this.showSpecificLocation
    });
  }

  // Methods to handle input changes
  onCountryChange(newCountry: string): void {
    this.country = newCountry;
    this.saveFormData();
  }
  onStreetChange(newStreet: string): void {
    this.street = newStreet;
    this.saveFormData();
  }
  onAptChange(newApt: string): void {
    this.apt = newApt;
    this.saveFormData();
  }
  onCityChange(newCity: string): void {
    this.city = newCity;
    this.saveFormData();
  }
  onStateChange(newState: string): void {
    this.state = newState;
    this.saveFormData();
  }
  onZipcodeChange(newZipcode: string): void {
    this.zipcode = newZipcode;
    this.saveFormData();
  }
  onLocationPreferenceChange(value: boolean): void {
    this.showSpecificLocation = value;
    this.saveFormData();
  }
}
