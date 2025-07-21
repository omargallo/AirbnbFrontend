import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WizardStepOneComponent } from './steps/step-one/step-one';
import { WizardStepTwoComponent } from './steps/step-two/step-two';
import { WizardStepThreeComponent } from './steps/step-three/step-three';

@Component({
  selector: 'app-listing-wizard',
  templateUrl: './listing-wizard.html',
  styleUrls: ['./listing-wizard.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardStepOneComponent,
    WizardStepTwoComponent,
    WizardStepThreeComponent
  ]
})
export class ListingWizardComponent implements OnInit {
  currentStep = 1;
  currentSubStep = 0;
  stepTwoSubStep = 0;
  stepThreeSubStep = 0;
  totalSteps = 3;
  showIntro = true;
  wizardForm: FormGroup;

  stepTitles = [
    'Tell us about your place',
    'Make your place stand out', 
    'Finish up and publish'
  ];

  stepSubtitles = [
    'Share some basic info, like where it is and how many guests can stay.',
    'Add some of the amenities your place offers, plus 5 or more photos.',
    'Finally, you\'ll choose booking settings, set up pricing, and publish your listing.'
  ];

  stepThreeSubTitles = [
    'Pick your booking settings',
    'Choose who to welcome for your first reservation',
    'Set your base price',
    'Set a weekend price',
    'Add discounts',
    'Share safety details',
    'Provide a few final details'
  ];

  constructor(private fb: FormBuilder) {
    this.wizardForm = this.fb.group({
      // Step 1 - Basic Info
      propertyType: [''],
      location: [''],
      guests: [1],
      bedrooms: [1],
      bathrooms: [1],
      
      // Step 2 - Details
      amenities: [[]],
      title: [''],
      description: [''],
      photos: [[]],
      highlights: [[]],
      
      // Step 3 - Final
      price: [''],
      weekdayPrice: [''],
      weekendPrice: [''],
      weekendPremium: [''],
      instantBook: [false],
      guestPreference: ['experienced'],
      newListingPromotion: [false],
      lastMinuteDiscount: [false],
      weeklyDiscount: [false],
      monthlyDiscount: [false],
      securityCamera: [false],
      noiseMonitor: [false],
      weaponsOnProperty: [false],
      hostingAsBusiness: [false],
      address: this.fb.group({
        apartment: [''],
        street: [''],
        city: [''],
        governorate: [''],
        postalCode: ['']
      })
    });
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.showIntro) {
      this.showIntro = false;
      return;
    }
    
    if (this.currentStep === 1 && this.currentSubStep < 3) {
      this.currentSubStep++;
    } else if (this.currentStep === 2 && this.stepTwoSubStep < 5) {
      this.stepTwoSubStep++;
    } else if (this.currentStep === 3 && this.stepThreeSubStep < 7) {
      this.stepThreeSubStep++;
    } else if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.currentSubStep = 0;
      this.stepTwoSubStep = 0;
      this.stepThreeSubStep = 0;
    }
  }

  prevStep(): void {
    if (this.currentStep === 1 && this.currentSubStep > 0) {
      this.currentSubStep--;
    } else if (this.currentStep === 2 && this.stepTwoSubStep > 0) {
      this.stepTwoSubStep--;
    } else if (this.currentStep === 3 && this.stepThreeSubStep > 0) {
      this.stepThreeSubStep--;
    } else if (this.currentStep > 1) {
      this.currentStep--;
      this.currentSubStep = 0;
      this.stepTwoSubStep = 0;
      this.stepThreeSubStep = 0;
    }
  }

  skipIntro(): void {
    this.showIntro = false;
  }

  canProceed(): boolean {
    if (this.showIntro) return true;
    
    if (this.currentStep === 1) {
      if (this.currentSubStep === 0) return true;
      if (this.currentSubStep === 1) return !!this.wizardForm.get('propertyType')?.value;
      if (this.currentSubStep === 2) return !!this.wizardForm.get('location')?.value;
      return true;
    }
    
    if (this.currentStep === 2) {
      if (this.stepTwoSubStep === 0) return true;
      if (this.stepTwoSubStep === 1) return this.wizardForm.get('amenities')?.value?.length > 0;
      if (this.stepTwoSubStep === 2) return this.wizardForm.get('photos')?.value?.length >= 5;
      if (this.stepTwoSubStep === 3) return !!this.wizardForm.get('title')?.value;
      if (this.stepTwoSubStep === 4) return this.wizardForm.get('highlights')?.value?.length > 0;
      return true;
    }
    
    if (this.currentStep === 3) {
      if (this.stepThreeSubStep === 0) return true;
      if (this.stepThreeSubStep === 1) return !!this.wizardForm.get('instantBook')?.value;
      if (this.stepThreeSubStep === 2) return !!this.wizardForm.get('guestPreference')?.value;
      if (this.stepThreeSubStep === 3) return !!this.wizardForm.get('weekdayPrice')?.value;
      if (this.stepThreeSubStep === 4) return !!this.wizardForm.get('weekendPrice')?.value;
      if (this.stepThreeSubStep === 5) return true; // Discounts are optional
      if (this.stepThreeSubStep === 6) return true; // Safety details are optional
      return !!this.wizardForm.get('address.street')?.value && 
             !!this.wizardForm.get('address.city')?.value;
    }
    
    return true;
  }

  getProgressPercentage(): number {
    if (this.showIntro) return 0;
    if (this.currentStep === 1) {
      return ((this.currentSubStep + 1) / 4) * 25;
    }
    if (this.currentStep === 2) {
      return 25 + ((this.stepTwoSubStep + 1) / 6) * 25;
    }
    return 50 + ((this.stepThreeSubStep + 1) / 8) * 50;
  }

  isFirstStep(): boolean {
    return this.showIntro || 
           (this.currentStep === 1 && this.currentSubStep === 0) || 
           (this.currentStep === 2 && this.stepTwoSubStep === 0) ||
           (this.currentStep === 3 && this.stepThreeSubStep === 0);
  }

  isLastStep(): boolean {
    return this.currentStep === this.totalSteps && this.stepThreeSubStep === 7;
  }

  onSubmit(): void {
    console.log('Wizard completed:', this.wizardForm.value);
  }
}