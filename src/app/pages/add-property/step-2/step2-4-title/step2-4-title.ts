import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';

@Component({
  selector: 'app-step2-4-title',
  imports: [FormsModule],
  templateUrl: './step2-4-title.html',
  styleUrl: './step2-4-title.css'
})
export class Step24Title implements AfterViewInit, OnInit, OnDestroy {
  private subscription!: Subscription;
  title: string = '';
  maxLength: number = 20;
  minLength: number = 5;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private validationService: ListingValidationService
  ) {}

  ngOnInit() {
    this.loadFromStorage();

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });

    // Initial validation
    this.saveFormData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadFromStorage() {
    const savedData = this.formStorage.getStepData('step2-4');
    if (savedData?.title) {
      this.title = savedData.title;
    }
  }

  private saveFormData() {
    const trimmedTitle = this.title.trim();
    const data = {
      title: trimmedTitle,
      isValid: trimmedTitle.length >= this.minLength && trimmedTitle.length <= this.maxLength
    };
    this.formStorage.saveFormData('step2-4', data);
    this.validationService.validateStep('step2-4-title');
  }

  get charCount(): number {
    return this.title.length;
  }

  get limitReached(): boolean {
    return this.charCount >= this.maxLength;
  }

  onTitleChange(): void {
    this.saveFormData();
  }

  ngAfterViewInit() {
    this.autoResize();
  }

  onInput() {
    this.autoResize();
    this.saveFormData();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (this.title.length >= this.maxLength && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  }

  autoResize() {
    if (this.titleInput) {
      const textarea = this.titleInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
