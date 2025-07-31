import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PropertyService, PropertyTypeDto } from '../../../core/services/Property/property.service';

export interface PropertyTypeSectionData {
  propertyTypeId: number;
}

@Component({
  selector: 'app-property-type-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['../update-list.css' , './property-type-section.css'],
  templateUrl: './property-type-section.html',
})
export class PropertyTypeSectionComponent implements OnInit, OnDestroy {
  @Input() data: PropertyTypeSectionData | null = null;
  @Output() dataChange = new EventEmitter<PropertyTypeSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  propertyTypeForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: number = 0;

  // Dynamic property types from API
  propertyTypes: PropertyTypeDto[] = [];
  isLoadingPropertyTypes = false;
  propertyTypesError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadPropertyTypes();
    this.setupFormData();
    this.setupFormChangeTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.propertyTypeForm = this.fb.group({
      propertyTypeId: [0, Validators.required]
    });
  }

  private loadPropertyTypes(): void {
    this.isLoadingPropertyTypes = true;
    this.propertyTypesError = null;

    this.propertyService.getAllPropertyTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (propertyTypes) => {
          this.propertyTypes = propertyTypes;
          this.isLoadingPropertyTypes = false;
          console.log('Loaded property types:', propertyTypes);
        },
        error: (error) => {
          console.error('Failed to load property types:', error);
          this.propertyTypesError = 'Failed to load property types';
          this.isLoadingPropertyTypes = false;
          
          // Fallback to hardcoded types if API fails
          this.propertyTypes = [
            { id: 1, name: 'House', iconURL: 'assets/images/property-types/house.png' },
            { id: 2, name: 'Apartment', iconURL: 'assets/images/property-types/apartment.png' },
            { id: 3, name: 'Condo', iconURL: 'assets/images/property-types/condo.png' },
            { id: 4, name: 'Villa', iconURL: 'assets/images/property-types/villa.png' },
            { id: 5, name: 'Townhouse', iconURL: 'assets/images/property-types/townhouse.png' },
            { id: 6, name: 'Cabin', iconURL: 'assets/images/property-types/cabin.png' },
            { id: 7, name: 'Loft', iconURL: 'assets/images/property-types/loft.png' },
            { id: 8, name: 'Studio', iconURL: 'assets/images/property-types/studio.png' },
            { id: 9, name: 'Guesthouse', iconURL: 'assets/images/property-types/guesthouse.png' },
            { id: 10, name: 'Hotel', iconURL: 'assets/images/property-types/hotel.png' }
          ];
        }
      });
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = this.data.propertyTypeId;
      this.propertyTypeForm.patchValue({ propertyTypeId: this.data.propertyTypeId });
    }
  }

  private setupFormChangeTracking(): void {
    this.propertyTypeForm.get('propertyTypeId')?.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const hasChanges = value !== this.initialValue;
        const isValid = this.propertyTypeForm.valid && value > 0;
        
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        if (hasChanges) {
          this.dataChange.emit({ propertyTypeId: value });
        }
      });
  }

  selectPropertyType(typeId: number): void {
    this.propertyTypeForm.patchValue({ propertyTypeId: typeId });
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    this.initialValue = this.propertyTypeForm.get('propertyTypeId')?.value || 0;
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): PropertyTypeSectionData {
    return { propertyTypeId: this.propertyTypeForm.get('propertyTypeId')?.value || 0 };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return this.propertyTypeForm.valid && (this.propertyTypeForm.get('propertyTypeId')?.value > 0);
  }

  // Method to get property type name by ID
  getPropertyTypeName(typeId: number): string {
    const propertyType = this.propertyTypes.find(type => type.id === typeId);
    return propertyType?.name || '';
  }

  // Method to retry loading property types
  retryLoadPropertyTypes(): void {
    this.loadPropertyTypes();
  }

  // TrackBy function for better performance
  trackByPropertyType(index: number, propertyType: PropertyTypeDto): number {
    return propertyType.id;
  }
}