import { Component } from '@angular/core';
import { HeaderComponent } from './header/header';
import { FooterComponent } from './footer/footer';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-wizard-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer
      [currentStep]="currentStep"
      [totalSteps]="totalSteps"
      [canProceed]="canProceed"
      (back)="handleBack()"
      (next)="handleNext()"
      (getStarted)="handleGetStarted()"
    ></app-footer>
  `,
  styleUrls: []
})
export class WizardLayout {
  currentStep: number = 1;
  totalSteps: number = 21; // Update to match your step sequence length
  canProceed: boolean = true;
  isFirstStep: boolean = false;
  isLastStep: boolean = false;
  progressPercentage: number = 0;
  showFooter: boolean = true;
  showBackButton: boolean = true;

  private stepSequence: string[] = [
    'step1-1-tell-us',
    'step1-2-which-of',
    'step1-3-what-type',
    'step1-4-1-where',
    'step1-4-2-confirm-address',
    'step1-5-basic-about',
    'step2-1-make-your',
    'step2-2-tell-guests',
    'step2-3-1-add-photos',
    'step2-3-2-photos-modal',
    'step2-3-3-photos-ta-da',
    'step2-4-title',
    'step2-5-describe',
    'step2-6-description',
    'step3-1-finish',
    'step3-2-pick-booking',
    'step3-3-choose-welcome',
    'step3-4-1-pricing',
    'step3-4-2-pricing-tax',
    'step3-5-add-discount',
    'step3-6-safety',
    'step3-7-final-details'
  ];

  constructor(private router: Router) {}

  handleBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.navigateToStep(this.currentStep - 1);
    }
  }

  handleNext() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.navigateToStep(this.currentStep - 1);
    }
  }

  handleGetStarted() {
    // On get started, go to first step
    this.currentStep = 1;
    this.navigateToStep(0);
  }

  private navigateToStep(index: number) {
    if (index >= 0 && index < this.stepSequence.length) {
      const route = this.stepSequence[index];
      this.router.navigate([`/listing-wizard/${route}`]);
    }
  }
}