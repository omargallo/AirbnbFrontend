import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, forkJoin } from 'rxjs';
import { PropertyService, AmenityDTO } from '../../../core/services/Property/property.service';
import { environment } from '../../../../environments/environment.development';

export interface AmenitiesSectionData {
  amenities: AmenityDTO[];
}

@Component({
  selector: 'app-amenities-section',
  standalone: true,
  styleUrls: ['../update-list.css','./amenities-section.css'],
  imports: [CommonModule, ReactiveFormsModule],  
  templateUrl: './amenities-section.html',
})
export class AmenitiesSectionComponent implements OnInit, OnDestroy {
  @Input() data: AmenitiesSectionData | null = null;
  @Input() propertyId: number | null = null; // Add propertyId input
  @Output() dataChange = new EventEmitter<AmenitiesSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  amenitiesForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialSelectedAmenities: AmenityDTO[] = [];

  // Available amenities from API
  availableAmenities: AmenityDTO[] = [];
  selectedAmenities: AmenityDTO[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadAmenities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.amenitiesForm = this.fb.group({
      selectedAmenityIds: [[]]
    });
  }

  private loadAmenities(): void {
    this.isLoading = true;
    
    const loadRequests = [
      this.propertyService.getAllAmenities()
    ];

    // Add property-specific amenities request if propertyId is provided
    if (this.propertyId) {
      loadRequests.push(this.propertyService.getAmenitiesByPropertyId(this.propertyId));
    }

    forkJoin(loadRequests).subscribe({
      next: (results) => {
        // Process all amenities and fix image URLs
        this.availableAmenities = results[0].map(amenity => ({
          ...amenity,
          iconUrl: this.getFullImageUrl(amenity.iconUrl)
        }));
        
        if (results.length > 1) {
          // Property-specific amenities - also fix image URLs
          this.selectedAmenities = results[1].map(amenity => ({
            ...amenity,
            iconUrl: this.getFullImageUrl(amenity.iconUrl)
          }));
          this.initialSelectedAmenities = [...this.selectedAmenities];
          
          // Update form with selected amenity IDs
          const selectedIds = this.selectedAmenities.map(a => a.id);
          this.amenitiesForm.patchValue({ selectedAmenityIds: selectedIds });
        } else {
          // If no property-specific amenities loaded, initialize empty
          this.selectedAmenities = [];
          this.initialSelectedAmenities = [];
          this.amenitiesForm.patchValue({ selectedAmenityIds: [] });
        }
        
        this.setupFormChangeTracking();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading amenities:', error);
        this.isLoading = false;
      }
    });
  }

  private getFullImageUrl(iconUrl: string): string {
  if (!iconUrl) return '';
  
  if (iconUrl.startsWith('http')) {
    return iconUrl;
  }
  
 
  const serverUrl = 'https://localhost:7025';  
  return `${serverUrl}/${iconUrl.replace(/^\/+/, '')}`; 
}

  private setupFormChangeTracking(): void {
    this.amenitiesForm.get('selectedAmenityIds')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((selectedIds: number[]) => {
        // Update selected amenities based on IDs
        this.selectedAmenities = this.availableAmenities.filter(amenity => 
          selectedIds.includes(amenity.id)
        );
        
        const hasChanges = this.hasAmenityChanges();
        const isValid = true; // Amenities are always valid
        
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        if (hasChanges) {
          this.dataChange.emit({ amenities: this.selectedAmenities });
        }
      });
  }

  private hasAmenityChanges(): boolean {
    const currentIds = this.selectedAmenities.map(a => a.id).sort();
    const initialIds = this.initialSelectedAmenities.map(a => a.id).sort();
    return JSON.stringify(currentIds) !== JSON.stringify(initialIds);
  }

  toggleAmenity(amenity: AmenityDTO): void {
    if (!this.propertyId) {
      console.error('Property ID is required to toggle amenities');
      console.log('Current propertyId:', this.propertyId);
      return;
    }

    console.log('Toggling amenity:', amenity.name, 'for property:', this.propertyId);

    // Optimistic update
    const currentIds = this.amenitiesForm.get('selectedAmenityIds')?.value || [];
    const index = currentIds.indexOf(amenity.id);

    let newIds: number[];
    if (index > -1) {
      // Remove amenity
      newIds = currentIds.filter((id: number) => id !== amenity.id);
    } else {
      // Add amenity
      newIds = [...currentIds, amenity.id];
    }

    // Update form immediately for UI responsiveness
    this.amenitiesForm.patchValue({ selectedAmenityIds: newIds });

    // Call API to toggle on backend
    this.propertyService.togglePropertyAmenity(amenity.id, this.propertyId).subscribe({
      next: (result) => {
        console.log('Toggle amenity result:', result);
        if (!result.isSuccess) {
          console.error('Failed to toggle amenity:', result.message);
          // Revert the change if API call failed
          this.amenitiesForm.patchValue({ selectedAmenityIds: currentIds });
        } else {
          console.log('Successfully toggled amenity:', amenity.name);
        }
      },
      error: (error) => {
        console.error('Error toggling amenity:', error);
        // Revert the change if API call failed
        this.amenitiesForm.patchValue({ selectedAmenityIds: currentIds });
      }
    });
  }

  removeAmenity(amenity: AmenityDTO): void {
    if (!this.propertyId) {
      console.error('Property ID is required to remove amenities');
      return;
    }

    const currentIds = this.amenitiesForm.get('selectedAmenityIds')?.value || [];
    const newIds = currentIds.filter((id: number) => id !== amenity.id);
    
    // Update form immediately
    this.amenitiesForm.patchValue({ selectedAmenityIds: newIds });

    // Call API to remove
    this.propertyService.togglePropertyAmenity(amenity.id, this.propertyId).subscribe({
      next: (result) => {
        if (!result.isSuccess) {
          console.error('Failed to remove amenity:', result.message);
          // Revert if failed
          this.amenitiesForm.patchValue({ selectedAmenityIds: currentIds });
        }
      },
      error: (error) => {
        console.error('Error removing amenity:', error);
        // Revert if failed
        this.amenitiesForm.patchValue({ selectedAmenityIds: currentIds });
      }
    });
  }

  isAmenitySelected(amenity: AmenityDTO): boolean {
    const selectedIds = this.amenitiesForm.get('selectedAmenityIds')?.value || [];
    return selectedIds.includes(amenity.id);
  }

  getSelectedAmenities(): AmenityDTO[] {
    return this.selectedAmenities;
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    this.initialSelectedAmenities = [...this.selectedAmenities];
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): AmenitiesSectionData {
    return { amenities: this.selectedAmenities };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return true; // Amenities are always valid
  }

  // Method to clear all selected amenities
  clearAllAmenities(): void {
    if (!this.propertyId) {
      console.error('Property ID is required to clear amenities');
      return;
    }

    // Clear all amenities one by one (could be optimized with a batch endpoint)
    const currentAmenities = [...this.selectedAmenities];
    this.amenitiesForm.patchValue({ selectedAmenityIds: [] });

    // Note: You might want to implement a batch clear endpoint for better performance
    currentAmenities.forEach(amenity => {
      this.propertyService.togglePropertyAmenity(amenity.id, this.propertyId!).subscribe({
        error: (error) => console.error(`Error clearing amenity ${amenity.name}:`, error)
      });
    });
  }

  // Method to select multiple amenities (for programmatic use)
  selectAmenities(amenityIds: number[]): void {
    if (!this.propertyId) {
      console.error('Property ID is required to select amenities');
      return;
    }

    const validIds = amenityIds.filter(id => 
      this.availableAmenities.some(amenity => amenity.id === id)
    );
    
    this.amenitiesForm.patchValue({ selectedAmenityIds: validIds });
  }
}