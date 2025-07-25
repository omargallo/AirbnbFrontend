import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface RoomsSectionData {
  bedrooms: number;
  beds: number;
  bathrooms: number;
}

@Component({
  selector: 'app-rooms-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['../update-list.css','./rooms-section.css'],
  templateUrl: './rooms-section.html',
})
export class RoomsSectionComponent implements OnInit, OnDestroy {
  @Input() data: RoomsSectionData | null = null;
  @Output() dataChange = new EventEmitter<RoomsSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  roomsForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: RoomsSectionData = { bedrooms: 1, beds: 1, bathrooms: 1 };

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
    this.roomsForm = this.fb.group({
      bedrooms: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      beds: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      bathrooms: [1, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = { ...this.data };
      this.roomsForm.patchValue({
        bedrooms: this.data.bedrooms,
        beds: this.data.beds,
        bathrooms: this.data.bathrooms
      });
    }
  }

  private setupFormChangeTracking(): void {
    this.roomsForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const hasChanges = this.hasFormChanges(value);
        const isValid = this.roomsForm.valid;

        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);

        if (hasChanges) {
          this.dataChange.emit({
            bedrooms: Number(value.bedrooms),
            beds: Number(value.beds),
            bathrooms: Number(value.bathrooms)
          });
        }
      });
  }

  private hasFormChanges(currentValue: any): boolean {
    return (
      Number(currentValue.bedrooms) !== this.initialValue.bedrooms ||
      Number(currentValue.beds) !== this.initialValue.beds ||
      Number(currentValue.bathrooms) !== this.initialValue.bathrooms
    );
  }

  // Counter methods for bedrooms
  incrementBedrooms(): void {
    const current = this.roomsForm.get('bedrooms')?.value || 1;
    if (current < 50) {
      this.roomsForm.patchValue({ bedrooms: current + 1 });
    }
  }

  decrementBedrooms(): void {
    const current = this.roomsForm.get('bedrooms')?.value || 1;
    if (current > 1) {
      this.roomsForm.patchValue({ bedrooms: current - 1 });
    }
  }

  // Counter methods for beds
  incrementBeds(): void {
    const current = this.roomsForm.get('beds')?.value || 1;
    if (current < 50) {
      this.roomsForm.patchValue({ beds: current + 1 });
    }
  }

  decrementBeds(): void {
    const current = this.roomsForm.get('beds')?.value || 1;
    if (current > 1) {
      this.roomsForm.patchValue({ beds: current - 1 });
    }
  }

  // Counter methods for bathrooms
  incrementBathrooms(): void {
    const current = this.roomsForm.get('bathrooms')?.value || 1;
    if (current < 50) {
      this.roomsForm.patchValue({ bathrooms: current + 1 });
    }
  }

  decrementBathrooms(): void {
    const current = this.roomsForm.get('bathrooms')?.value || 1;
    if (current > 1) {
      this.roomsForm.patchValue({ bathrooms: current - 1 });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.roomsForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.roomsForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['min']) return 'Minimum value is 1';
      if (field.errors['max']) return 'Maximum value is 50';
    }
    return '';
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    const currentValue = this.roomsForm.value;
    this.initialValue = {
      bedrooms: Number(currentValue.bedrooms),
      beds: Number(currentValue.beds),
      bathrooms: Number(currentValue.bathrooms)
    };
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): RoomsSectionData {
    const value = this.roomsForm.value;
    return {
      bedrooms: Number(value.bedrooms),
      beds: Number(value.beds),
      bathrooms: Number(value.bathrooms)
    };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return this.roomsForm.valid;
  }
}  
