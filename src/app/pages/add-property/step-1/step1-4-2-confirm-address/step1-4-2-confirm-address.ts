import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';

@Component({
  selector: 'app-step1-4-2-confirm-address',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
  latitude: number = 0;
  longitude: number = 0;
  formattedAddress: string = '';

  // Location preference toggle
  showSpecificLocation: boolean = true;
  
  // Country display
  countryName: string = '';

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private validationService: ListingValidationService
  ) {}

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step1-4-2');
    if (savedData) {
      this.country = savedData.country || this.country;
      this.countryName = savedData.countryName || this.countryName;
      this.street = savedData.street || this.street;
      this.apt = savedData.apt || this.apt;
      this.city = savedData.city || this.city;
      this.state = savedData.state || this.state;
      this.zipcode = savedData.zipcode || this.zipcode;
      this.latitude = savedData.latitude || this.latitude;
      this.longitude = savedData.longitude || this.longitude;
      this.formattedAddress = savedData.formattedAddress || this.formattedAddress;
      this.showSpecificLocation = savedData.showSpecificLocation ?? true;
    }

    // Get the location data from previous step if available
    const locationData = this.formStorage.getStepData('step1-4-1');
    if (locationData && (!savedData || !savedData.formattedAddress)) {
      this.latitude = locationData.latitude;
      this.longitude = locationData.longitude;
      this.formattedAddress = locationData.address;
      this.reverseGeocode(this.latitude, this.longitude);
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });
    
    // Initial validation
    this.validateForm();
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      if (data.address) {
        const address = data.address;
        this.countryName = address.country || '';
        this.country = data.address.country_code?.toUpperCase() || '';
        this.street = [address.road, address.house_number].filter(Boolean).join(' ') || '';
        this.city = address.city || address.town || address.village || '';
        this.state = address.state || '';
        this.zipcode = address.postcode || '';
        this.formattedAddress = data.display_name;
        this.saveFormData();
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private saveFormData(): void {
    const formData = {
      country: this.country,
      countryName: this.countryName,
      street: this.street,
      apt: this.apt,
      city: this.city,
      state: this.state,
      zipcode: this.zipcode,
      latitude: this.latitude,
      longitude: this.longitude,
      formattedAddress: this.formattedAddress,
      showSpecificLocation: this.showSpecificLocation
    };
    
    this.formStorage.saveFormData('step1-4-2', formData);
    // Validate after saving
    this.validateForm();
  }

  private validateForm(): void {
    // Validate zipcode with strict requirements
    const hasZipcode = !!this.zipcode && this.zipcode.length > 0;
    const isZipcodeValid = hasZipcode && 
      this.zipcode.length >= 3 && 
      this.zipcode.length <= 10 && 
      /^\d+$/.test(this.zipcode);

    // If zipcode has 1 or 2 digits, it's invalid
    if (hasZipcode && this.zipcode.length < 3) {
      this.formStorage.saveFormData('step1-4-2', {
        ...this.formStorage.getStepData('step1-4-2'),
        isValid: false
      });
      return;
    }

    // Trim values to ensure empty strings are not considered valid
    const isValid = 
      !!this.country?.trim() &&
      !!this.street?.trim() &&
      !!this.city?.trim() &&
      !!this.state?.trim() &&
      isZipcodeValid;

    // Update validation state with the actual validation result
    const data = this.formStorage.getStepData('step1-4-2');
    this.formStorage.saveFormData('step1-4-2', {
      ...data,
      isValid: isValid
    });
    this.validationService.validateStep('step1-4-2-confirm-address');
  }

  // Methods to handle input changes
  onCountryChange(newCountry: string): void {
    this.country = newCountry;
    this.saveFormData();
    this.validateForm();
  }
  onStreetChange(newStreet: string): void {
    this.street = newStreet;
    this.saveFormData();
    this.validateForm();
  }
  onAptChange(newApt: string): void {
    this.apt = newApt;
    this.saveFormData();
    // No validation needed for apt as it's optional
  }
  onCityChange(newCity: string): void {
    this.city = newCity;
    this.saveFormData();
    this.validateForm();
  }
  onStateChange(newState: string): void {
    this.state = newState;
    this.saveFormData();
    this.validateForm();
  }
  validateZipcode(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, '');
    
    // Enforce length constraints
    if (value.length > 10) {
      value = value.slice(0, 10);
      // Prevent further input if already at max length
      input.blur(); // Remove focus to prevent further typing
    }
    
    // Update the input value and model
    input.value = value;
    this.zipcode = value;
    
    // Explicitly handle validation for 1-2 digits
    if (value.length > 0 && value.length < 3) {
      this.formStorage.saveFormData('step1-4-2', {
        ...this.formStorage.getStepData('step1-4-2'),
        zipcode: value,
        isValid: false
      });
      this.validationService.validateStep('step1-4-2-confirm-address');
      return;
    }
    
    this.validateForm();
    this.validationService.validateStep('step1-4-2-confirm-address');
  }

  onZipcodeKeyPress(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Prevent input if already at 10 digits
    if (value.length >= 10) {
      event.preventDefault();
      return;
    }
    
    // Only allow numeric input
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
      return;
    }
  }

  onZipcodeChange(newZipcode: string): void {
    // This will still be called for ngModel updates
    this.zipcode = newZipcode;
    this.saveFormData();
    this.validateForm();
  }
  onLocationPreferenceChange(value: boolean): void {
    this.showSpecificLocation = value;
    this.saveFormData();
  }
}
