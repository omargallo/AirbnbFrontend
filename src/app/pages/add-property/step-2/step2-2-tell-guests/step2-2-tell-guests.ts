import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { AmenityService, AmenityDTO } from '../../../../core/services/Amenity/amenity.service';
import { HandleImgService } from '../../../../core/services/handleImg.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';
import { createGlobalPositionStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-step2-2-tell-guests',
  imports: [CommonModule],
  templateUrl: './step2-2-tell-guests.html',
  styleUrl: './step2-2-tell-guests.css'
})
export class Step22TellGuests implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private loadingSubscription?: Subscription;
  handleImgService = inject(HandleImgService);

  // All amenities from backend
  amenities: AmenityDTO[] = [];
  isLoading = true;
  error: string | null = null;

  // Selected amenities are stored by ID for efficient lookup
  selectedAmenityIds: Set<number> = new Set();

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private amenityService: AmenityService,
    private validationService: ListingValidationService
  ) {}

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step2-2');
    if (savedData?.selectedAmenityIds) {
      this.selectedAmenityIds = new Set(savedData.selectedAmenityIds);
    }

    // Load amenities from backend
    this.loadingSubscription = this.amenityService.getAllAmenities().subscribe({
      next: (amenities) => {
        this.amenities = amenities;
        this.isLoading = false;
        console.log('Amenities loaded:', this.amenities);
      },
      error: (error) => {
        console.error('Failed to load amenities:', error);
        this.error = 'Failed to load amenities. Please try again.';
        this.isLoading = false;
      }
    });

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });

    // Initial validation if there are saved selections
    if (this.selectedAmenityIds.size > 0) {
      this.validationService.validateStep('step2-2-tell-guests');
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  // Method to toggle amenity selection
  toggleAmenity(amenity: AmenityDTO): void {
    if (this.selectedAmenityIds.has(amenity.id)) {
      this.selectedAmenityIds.delete(amenity.id);
    } else {
      this.selectedAmenityIds.add(amenity.id);
    }
    this.saveFormData();
    this.validationService.validateStep('step2-2-tell-guests');
  }

  private saveFormData(): void {
    const data = {
      selectedAmenityIds: Array.from(this.selectedAmenityIds),
      selectedAmenities: this.amenities.filter(a => this.selectedAmenityIds.has(a.id))
    };
    this.formStorage.saveFormData('step2-2', data);
  }

  // Method to check if amenity is selected
  isAmenitySelected(amenity: AmenityDTO): boolean {
    return this.selectedAmenityIds.has(amenity.id);
  }

  // Get the amenities for property creation
  getSelectedAmenities(): AmenityDTO[] {
    return this.amenities.filter(amenity => this.selectedAmenityIds.has(amenity.id));
  }

  getAmenitiesImg(image:string): string {
    return this.handleImgService.handleImage(
      image? image : ''
    );
  }
}