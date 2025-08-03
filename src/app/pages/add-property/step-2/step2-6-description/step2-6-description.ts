import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';

@Component({
  selector: 'app-step2-6-description',
  imports: [FormsModule],
  templateUrl: './step2-6-description.html',
  styleUrl: './step2-6-description.css'
})
export class Step26Description implements AfterViewInit, OnInit, OnDestroy {
  description: string = '';
  maxLength: number = 500;
  private subscription!: Subscription;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private validationService: ListingValidationService
  ) {}

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step2-6');
    if (savedData?.description) {
      this.description = savedData.description;
    }

    // Validate on load
    this.validateForm();

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });
  }

  ngAfterViewInit() {
    this.autoResize();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get charCount(): number {
    return this.description.length;
  }

  get limitReached(): boolean {
    return this.charCount >= this.maxLength;
  }

  onInput() {
    this.autoResize();
    this.onDescriptionChange(this.description);
  }

  onDescriptionChange(newDescription: string): void {
    this.description = newDescription;
    this.saveFormData();
    this.validateForm();
  }

  private validateForm(): void {
    // Require more than 20 characters for live validation
    const isValid = this.description.trim().length >= 20;
    this.wizardService.updateStepValidation('step2-6', isValid);
    // Also update the validation service for the step
    this.validationService.validateStep('step2-6-description');
  }

  autoResize() {
    if (this.descriptionInput) {
      const textarea = this.descriptionInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  private saveFormData(): void {
    this.formStorage.saveFormData('step2-6', { description: this.description });
  }
}
