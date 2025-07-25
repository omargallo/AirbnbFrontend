import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface PropertyTypeSectionData {
  propertyTypeId: number;
}

@Component({
  selector: 'app-property-type-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
   styleUrls: ['../update-list.css'],
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

  propertyTypes = [
    'House', 'Apartment', 'Condo', 'Villa', 'Townhouse',
    'Cabin', 'Loft', 'Studio', 'Guesthouse', 'Hotel'
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
    this.propertyTypeForm = this.fb.group({
      propertyTypeId: [0, Validators.required]
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
    return this.propertyTypes[typeId - 1] || '';
  }
}