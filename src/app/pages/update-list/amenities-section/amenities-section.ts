import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface AmenitiesSectionData {
  amenities: string[];
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
  @Output() dataChange = new EventEmitter<AmenitiesSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  amenitiesForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: string[] = [];

  availableAmenities = [
    'Wifi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning',
    'Heating', 'Dedicated workspace', 'TV', 'Hair dryer', 'Iron',
    'Pool', 'Hot tub', 'Free parking', 'EV charger', 'Crib',
    'Gym', 'BBQ grill', 'Breakfast', 'Indoor fireplace', 'Smoking allowed',
    'Pets allowed', 'Party or event friendly', 'Camera/recording device'
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormData();
    this.setupFormChangeTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.amenitiesForm = this.fb.group({
      amenities: [[]]
    });
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = [...this.data.amenities];
      this.amenitiesForm.patchValue({ amenities: [...this.data.amenities] });
    }
  }

  private setupFormChangeTracking(): void {
    this.amenitiesForm.get('amenities')?.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const hasChanges = JSON.stringify(value) !== JSON.stringify(this.initialValue);
        const isValid = true; // Amenities are always valid (can be empty)
        
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        if (hasChanges) {
          this.dataChange.emit({ amenities: value || [] });
        }
      });
  }

  toggleAmenity(amenity: string): void {
    const currentAmenities = this.amenitiesForm.get('amenities')?.value || [];
    const index = currentAmenities.indexOf(amenity);

    if (index > -1) {
      // Remove amenity
      currentAmenities.splice(index, 1);
    } else {
      // Add amenity
      currentAmenities.push(amenity);
    }

    this.amenitiesForm.patchValue({ amenities: [...currentAmenities] });
  }

  removeAmenity(amenity: string): void {
    const currentAmenities = this.amenitiesForm.get('amenities')?.value || [];
    const index = currentAmenities.indexOf(amenity);
    
    if (index > -1) {
      currentAmenities.splice(index, 1);
      this.amenitiesForm.patchValue({ amenities: [...currentAmenities] });
    }
  }

  isAmenitySelected(amenity: string): boolean {
    const currentAmenities = this.amenitiesForm.get('amenities')?.value || [];
    return currentAmenities.includes(amenity);
  }

  getSelectedAmenities(): string[] {
    return this.amenitiesForm.get('amenities')?.value || [];
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    this.initialValue = [...(this.amenitiesForm.get('amenities')?.value || [])];
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): AmenitiesSectionData {
    return { amenities: this.amenitiesForm.get('amenities')?.value || [] };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return true; // Amenities are always valid
  }

  // Method to clear all selected amenities
  clearAllAmenities(): void {
    this.amenitiesForm.patchValue({ amenities: [] });
  }

  // Method to select multiple amenities
  selectAmenities(amenities: string[]): void {
    const validAmenities = amenities.filter(amenity => 
      this.availableAmenities.includes(amenity)
    );
    this.amenitiesForm.patchValue({ amenities: validAmenities });
  }
}