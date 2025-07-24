import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface TitleSectionData {
  title: string;
}

@Component({
  selector: 'app-title-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
   styleUrls: ['../update-list.css'],
  templateUrl: './title-section.html',
})
export class TitleSectionComponent implements OnInit, OnDestroy {
  @Input() data: TitleSectionData | null = null;
  @Output() dataChange = new EventEmitter<TitleSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  titleForm!: FormGroup;
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
    this.titleForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = this.data.title;
      this.titleForm.patchValue({ title: this.data.title });
    }
  }

  private setupFormChangeTracking(): void {
    this.titleForm.get('title')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const hasChanges = value !== this.initialValue;
        const isValid = this.titleForm.valid;
        
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        if (hasChanges) {
          this.dataChange.emit({ title: value });
        }
      });
  }

  isFieldInvalid(): boolean {
    const field = this.titleForm.get('title');
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(): string {
    const field = this.titleForm.get('title');
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['maxlength']) return 'Too long';
    }
    return '';
  }

  // Method to update initial value after successful save
  updateInitialValue(): void {
    this.initialValue = this.titleForm.get('title')?.value || '';
    this.hasChanges.emit(false);
  }

  // Method to get current form data
  getCurrentData(): TitleSectionData {
    return { title: this.titleForm.get('title')?.value || '' };
  }

  // Method to check if form is valid
  isValid(): boolean {
    return this.titleForm.valid;
  }
}