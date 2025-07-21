// listing-wizard-layout.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listing-wizard-layout',
  templateUrl: './listing-wizard-layout.html',
  styleUrls: ['./listing-wizard-layout.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ListingWizardLayoutComponent {
  @Input() showIntro: boolean = false;
  @Input() showFooter: boolean = true;
  @Input() isFirstStep: boolean = false;
  @Input() isLastStep: boolean = false;
  @Input() canProceed: boolean = true;
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 3;
  @Input() progressPercentage: number = 0;
  @Input() showBackButton: boolean = true;

  private readonly stepRoutes = [
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

  @Output() onSkipIntro = new EventEmitter<void>();
  @Output() onSaveExit = new EventEmitter<void>();
  @Output() onPrevStep = new EventEmitter<void>();
  @Output() onNextStep = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();

  getCurrentStepIndex(): number {
    const currentUrl = this.router.url.split('/').pop();
    return this.stepRoutes.indexOf(currentUrl || '');
  }

  navigateToNextStep(): void {
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex < this.stepRoutes.length - 1) {
      this.router.navigate(['listing-wizard', this.stepRoutes[currentIndex + 1]]);
    }
    this.onNextStep.emit();
  }

  navigateToPrevStep(): void {
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex > 0) {
      this.router.navigate(['listing-wizard', this.stepRoutes[currentIndex - 1]]);
    }
    this.onPrevStep.emit();
  }
}