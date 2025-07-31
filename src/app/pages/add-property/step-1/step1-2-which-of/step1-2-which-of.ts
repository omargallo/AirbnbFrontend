import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { PropertyService, PropertyTypeDto } from '../../../../core/services/Property/property.service';
import { HandleImgService } from '../../../../core/services/handleImg.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';

@Component({
  selector: 'app-step1-2-which-of',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step1-2-which-of.html',
  styleUrl: './step1-2-which-of.css',
})
export class Step12WhichOf implements OnInit, OnDestroy {
  private subscription!: Subscription;
  isLoading = true;
  error: string | null = null;
  propertyTypes: PropertyTypeDto[] = [];
  selectedType: PropertyTypeDto | null = null;
  handleImgService = inject(HandleImgService);

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private propertyService: PropertyService,
    private validationService: ListingValidationService
  ) {}

  ngOnInit(): void {
    // Load property types from backend
    this.isLoading = true;
    this.propertyService.getAllPropertyTypes().subscribe({
      next: (types) => {
        this.propertyTypes = types;
        this.isLoading = false;
        // After loading types, restore any previously saved selection
        const savedData = this.formStorage.getStepData('step1-2');
        if (savedData?.selectedType) {
          this.selectedType = this.propertyTypes.find(t => t.id === savedData.selectedType.id) || null;
        }
        // Validate step when initializing
        this.validationService.validateStep('step1-2-which-of');
      },
      error: (err) => {
        console.error('Failed to load property types:', err);
        this.error = 'Failed to load property types. Please try again.';
        this.isLoading = false;
        // Mark step as invalid when there's an error
        this.wizardService.updateStepValidation('step1-2', false);
      }
    });

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectType(type: PropertyTypeDto) {
    this.selectedType = type;
    this.saveData();
    // Manually trigger validation after saving
    this.validationService.validateStep('step1-2-which-of');
  }

  private saveData(): void {
    // Save to property_form_data in storage
    const data = this.selectedType ? {
      selectedType: this.selectedType,
      propertyTypeId: this.selectedType.id
    } : null;
    
    this.formStorage.saveFormData('step1-2', data);
  }

  getPropertyTypeImg(image: string): string {
    return this.handleImgService.handleImage(
      image ? image : ''
    );
  }
}