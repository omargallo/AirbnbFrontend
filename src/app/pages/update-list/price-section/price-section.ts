import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface PriceSectionData {
  price: number;
}

@Component({
  selector: 'app-price-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
   styleUrls: ['../update-list.css'],
  
  templateUrl: './price-section.html',
})
export class PriceSectionComponent implements OnInit, OnDestroy {
  @Input() data: PriceSectionData | null = null;
  @Output() dataChange = new EventEmitter<PriceSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  priceForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: number = 0;

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
    this.priceForm = this.fb.group({
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = this.data.price;
      this.priceForm.patchValue({ price: this.data.price });
    }
  }

  private setupFormChangeTracking(): void {
    this.priceForm.get('price')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const numericValue = Number(value) || 0;
        const hasChanges = numericValue !== this.initialValue;
        const isValid = this.priceForm.valid;
        
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        if (hasChanges) {
          this.dataChange.emit({ price: numericValue });
        }
      });
  }

  isFieldInvalid(): boolean {
    const field = this.priceForm.get('price');
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(): string {
    const field = this.priceForm.get('price');
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Price is required';
      if (field.errors['min']) return 'Price must be at least $1';
    }
    return '';
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    this.initialValue = Number(this.priceForm.get('price')?.value) || 0;
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): PriceSectionData {
    return { price: Number(this.priceForm.get('price')?.value) || 0 };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return this.priceForm.valid;
  }

  // Method to format price for display
  getFormattedPrice(): string {
    const price = this.priceForm.get('price')?.value;
    return price ? `$${price}` : '$0';
  }
}