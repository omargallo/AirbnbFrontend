import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface LocationSectionData {
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}


@Component({
  selector: 'app-location-section',
  standalone: true,
   styleUrls: ['../update-list.css','./location-section.css'],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-section.html',
 
})
export class LocationSectionComponent implements OnInit, OnDestroy {
  @Input() data: LocationSectionData | null = null;
  @Output() dataChange = new EventEmitter<LocationSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  locationForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: any = {};
  showCoordinates: boolean = false;

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
    this.locationForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      latitude: [null],
      longitude: [null]
    });
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = {
        address: this.data.location.address,
        city: this.data.location.city,
        country: this.data.location.country,
        latitude: this.data.location.coordinates?.lat || null,
        longitude: this.data.location.coordinates?.lng || null
      };

      this.locationForm.patchValue(this.initialValue);
      
      // Show coordinates section if there are existing coordinates
      if (this.data.location.coordinates?.lat && this.data.location.coordinates?.lng) {
        this.showCoordinates = true;
      }
    }
  }

  private setupFormChangeTracking(): void {
    this.locationForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const hasChanges = JSON.stringify(value) !== JSON.stringify(this.initialValue);
        const isValid = this.locationForm.valid;
        
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        if (hasChanges) {
          const locationData: LocationSectionData = {
            location: {
              address: value.address || '',
              city: value.city || '',
              country: value.country || '',
              coordinates: (value.latitude && value.longitude) ? {
                lat: Number(value.latitude),
                lng: Number(value.longitude)
              } : undefined
            }
          };
          this.dataChange.emit(locationData);
        }
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.locationForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.locationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    return '';
  }

  toggleCoordinates(): void {
    this.showCoordinates = !this.showCoordinates;
    
    if (!this.showCoordinates) {
      // Clear coordinates when hiding the section
      this.locationForm.patchValue({
        latitude: null,
        longitude: null
      });
    }
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    this.initialValue = { ...this.locationForm.value };
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): LocationSectionData {
    const formValue = this.locationForm.value;
    return {
      location: {
        address: formValue.address || '',
        city: formValue.city || '',
        country: formValue.country || '',
        coordinates: (formValue.latitude && formValue.longitude) ? {
          lat: Number(formValue.latitude),
          lng: Number(formValue.longitude)
        } : undefined
      }
    };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return this.locationForm.valid;
  }

  // Method to get current address as string
  getFullAddress(): string {
    const formValue = this.locationForm.value;
    const parts = [formValue.address, formValue.city, formValue.country].filter(Boolean);
    return parts.join(', ');
  }

  // Method to validate coordinates
  hasValidCoordinates(): boolean {
    const lat = this.locationForm.get('latitude')?.value;
    const lng = this.locationForm.get('longitude')?.value;
    
    if (!lat || !lng) return false;
    
    const latitude = Number(lat);
    const longitude = Number(lng);
    
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }

  // Method to clear coordinates
  clearCoordinates(): void {
    this.locationForm.patchValue({
      latitude: null,
      longitude: null
    });
  }
}