import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface DescriptionSectionData {
  description: string;
}

@Component({
  selector: 'app-description-section',
  standalone: true,
   styleUrls: ['../update-list.css'],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './description-section.html',

})

export class DescriptionSectionComponent implements OnInit, OnDestroy {
  @Input() data: DescriptionSectionData | null = null;
  @Output() dataChange = new EventEmitter<DescriptionSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  descriptionForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: string = '';

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
    this.descriptionForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = this.data.description;
      this.descriptionForm.patchValue({ description: this.data.description });
    }
  }

  private setupFormChangeTracking(): void {
    this.descriptionForm.get('description')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const hasChanges = value !== this.initialValue;
        const isValid = this.descriptionForm.valid;
        
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        if (hasChanges) {
          this.dataChange.emit({ description: value });
        }
      });
  }

  isFieldInvalid(): boolean {
    const field = this.descriptionForm.get('description');
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(): string {
    const field = this.descriptionForm.get('description');
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Description is required';
      if (field.errors['maxlength']) return 'Description is too long';
    }
    return '';
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    this.initialValue = this.descriptionForm.get('description')?.value || '';
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): DescriptionSectionData {
    return { description: this.descriptionForm.get('description')?.value || '' };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return this.descriptionForm.valid;
  }

  // Method to get character count
  getCharacterCount(): number {
    return (this.descriptionForm.get('description')?.value || '').length;
  }

  // Method to get remaining characters
  getRemainingCharacters(): number {
    return 500 - this.getCharacterCount();
  }
}