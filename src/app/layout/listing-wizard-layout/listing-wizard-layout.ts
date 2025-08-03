import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ListingWizardService } from '../../core/services/ListingWizard/listing-wizard.service';
import { PropertyCreationService } from '../../core/services/Property/property-creation.service';
import { PropertyFormStorageService } from '../../pages/add-property/services/property-form-storage.service';
import { ListingValidationService } from '../../core/services/ListingWizard/listing-validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listing-wizard-layout',
  templateUrl: './listing-wizard-layout.html',
  styleUrls: ['./listing-wizard-layout.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ListingWizardLayoutComponent {
  @Input() showFooter = true;
  @Input() isFirstStep = false;
  @Input() isLastStep = false;
  canProceed = true;
  @Input() currentStep = 1;
  @Input() totalSteps = 3;
  @Input() progressPercentage = 0;
  @Input() showBackButton = true;


  @Output() onPrevStep = new EventEmitter<void>();
  @Output() onNextStep = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();

  
  saveAndExit() {
    // The form data is already being saved by the PropertyFormStorageService
    // Just need to navigate to the host page
    this.router.navigate(['/host']);
  }

  private readonly stepRoutes: string[] = [
    '', // Corresponds to StepsPage
    'step1-1-tell-us',
    'step1-2-which-of',
    'step1-3-what-type',
    'step1-4-1-where',
    'step1-4-2-confirm-address',
    'step1-5-basic-about',
    'step2-1-make-your',
    'step2-2-tell-guests',
    'step2-3-1-add-photos',
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
    'step3-6-safety'
  ];

  constructor(
    private router: Router,
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private propertyCreationService: PropertyCreationService,
    private validationService: ListingValidationService,
    private snackBar: MatSnackBar
  ) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateProgress();
        this.updateStepState();
        this.validateCurrentStep();
      });

    this.validationService.canProceed$.subscribe(canProceed => {
      this.canProceed = canProceed;
    });
  }

  private showToast(
    message: string,
    vertical: 'top' | 'bottom',
    horizontal: 'left' | 'right'
  ) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
      panelClass: ['custom-snackbar'],
    });
  }

  handleSubmit() {
    console.log('=== STARTING PROPERTY SUBMISSION ===');

    const localStorageData = localStorage.getItem('property_form_data');
    console.log('📂 localStorage data:', localStorageData ? JSON.parse(localStorageData) : 'No data');

    const allFormData = this.formStorage.getFormData();
    console.log('📋 All form data from service:', allFormData);

    const step23Data = allFormData['step2-3'];
    console.log('📸 Step 2-3 data specifically:', step23Data);

    const hasImages = !!(
      step23Data &&
      (
        (step23Data.imageFiles && step23Data.imageFiles.length > 0) ||
        (step23Data.images && step23Data.images.length > 0)
      )
    );

    const imageCount =
      step23Data?.imageFiles?.length ??
      step23Data?.images?.length ??
      0;

    console.log('🔍 Image check results:');
    console.log('  - hasImages:', hasImages);
    console.log('  - imageCount:', imageCount);

    if (!hasImages) {
      console.error('❌ No images found!');
      this.showToast('Please upload at least one image before submitting the property.', 'bottom', 'left');
      return;
    }

    console.log(`✅ Found ${imageCount} images, proceeding...`);

    const propertyData = this.propertyCreationService.buildPropertyFromWizard();
    const finalPropertyData = {
      ...propertyData,
      images: propertyData.images || []
    };

    let  observable = this.propertyCreationService.createProperty(finalPropertyData)
    console.log("returned observable",observable)
    observable.subscribe({
      next: (response) => {
        console.log('✅ Property created successfully:', response);
        this.formStorage.clearFormData();
        localStorage.removeItem('property_form_data');
        // alert('Property created successfully!');
        this.router.navigate(['/host']);
        this.showToast('property created', 'top', 'right');
      },
      error: (error) => {
        console.error('❌ Error creating property:', error);
        this.showToast('Failed to create property: ' + error.message, 'bottom', 'left');
      }
    });
    // setTimeout(
    //   ()=> this.router.navigateByUrl("/host"),
    //   500
    // )
  }
  private getCurrentStepIndex(): number {
    const url = this.router.url;
    const wizardBasePath = '/listing-wizard';

    // Handle the root case for the wizard (steps-page)
    if (url === wizardBasePath || url === `${wizardBasePath}/`) {
      return this.stepRoutes.indexOf('');
    }

    // Handle all other steps
    const stepPath = url.substring(wizardBasePath.length + 1);
    return this.stepRoutes.indexOf(stepPath);
  }

  private updateProgress(): void {
    const currentStepIndex = this.getCurrentStepIndex();
    if (currentStepIndex !== -1) {
      this.progressPercentage = (currentStepIndex / (this.stepRoutes.length - 1)) * 100;
    }
  }

  private updateStepState(): void {
    const currentIndex = this.getCurrentStepIndex();
    this.isFirstStep = currentIndex === 0;
    this.isLastStep = currentIndex === this.stepRoutes.length - 1;
    this.showBackButton = currentIndex > 0;
  }

  private validateCurrentStep(): void {
    const currentRoute = this.stepRoutes[this.getCurrentStepIndex()];
    if (currentRoute) {
      this.validationService.validateStep(currentRoute);
    }
  }

  navigateToNextStep(): void {
    const currentIndex = this.getCurrentStepIndex();
    const currentRoute = this.stepRoutes[currentIndex];

    if (currentRoute && !this.validationService.validateStep(currentRoute)) {
      return; // Stop if validation fails
    }

    if (currentIndex > -1 && currentIndex < this.stepRoutes.length - 1) {
      // Trigger saving in the current component
      this.wizardService.triggerNextStep();

      // Let any parent components know
      this.onNextStep.emit();

      // Navigate to next step
      const nextStep = this.stepRoutes[currentIndex + 1];
      this.router.navigate(['listing-wizard', nextStep]);
    }
  }

  navigateToPrevStep(): void {
    const currentIndex = this.getCurrentStepIndex();

    if (currentIndex === 1) {
      // When on the first *real* step, navigate explicitly to the base URL.
      this.router.navigate(['/listing-wizard']);
    } else if (currentIndex > 1) {
      // For all other steps, navigate to the previous step in the array.
      const prevStep = this.stepRoutes[currentIndex - 1];
      this.router.navigate(['/listing-wizard', prevStep]);
    }

    this.onPrevStep.emit();
  }
}
