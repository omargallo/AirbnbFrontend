import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';

@Component({
  selector: 'app-step1-5-basic-about',
  imports: [],
  templateUrl: './step1-5-basic-about.html',
  styleUrl: './step1-5-basic-about.css'
})
export class Step15BasicAbout implements OnInit, OnDestroy {
  private subscription!: Subscription;

  // Counter values
  guests: number = 4;
  bedrooms: number = 1;
  beds: number = 1;
  bathrooms: number = 1;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private validationService: ListingValidationService
  ) {}

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step1-5');
    if (savedData) {
      this.guests = savedData.guests ?? 4;
      this.bedrooms = savedData.bedrooms ?? 1;
      this.beds = savedData.beds ?? 1;
      this.bathrooms = savedData.bathrooms ?? 1;
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });

    // Initial validation
    this.saveFormData();
    this.validationService.validateStep('step1-5-basic-about');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private saveFormData(): void {
    const data = {
      guests: this.guests,
      bedrooms: this.bedrooms,
      beds: this.beds,
      bathrooms: this.bathrooms,
      isValid: true // This step is always valid as long as values are within range
    };
    
    this.formStorage.saveFormData('step1-5', data);
  }

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
    this.saveFormData();
    this.validationService.validateStep('step1-5-basic-about');
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
    this.saveFormData();
    this.validationService.validateStep('step1-5-basic-about');
  }
}
