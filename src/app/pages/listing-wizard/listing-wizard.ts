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
  totalSteps = 3;
  wizardForm: FormGroup;

  stepTitles = [
    'Tell us about your place',
    'Make it stand out', 
    'Finish up and publish'
  ];

  stepSubtitles = [
    'Share some basic info, like where it is and how many guests can stay.',
    'Add photos, a title, and description—we\'ll help you out.',
    'Choose if you\'d like to start with an experienced guest, plus set your price.'
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
      
      // Step 3 - Final
      price: [''],
      instantBook: [false]
    });
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    // Add validation logic here based on current step
    return true;
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  isFirstStep(): boolean {
    return this.currentStep === 1;
  }

  isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  onSubmit(): void {
    console.log('Wizard completed:', this.wizardForm.value);
  }
}