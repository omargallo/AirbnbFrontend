import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Step232PhotosModal } from '../step2-3-2-photos-modal/step2-3-2-photos-modal';
import { Router } from '@angular/router';
// ...existing code...
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';

@Component({
  selector: 'app-step2-3-add-photos',
  imports: [CommonModule, Step232PhotosModal],
  templateUrl: './step2-3-1-add-photos.html',
  styleUrl: './step2-3-1-add-photos.css'
})
export class Step23AddPhotos implements OnInit, OnDestroy {
  private subscription!: Subscription;
  dropzoneHighlight = false;
  photos: string[] = [];

  constructor(
    private router: Router,
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private validationService: ListingValidationService
  ) {}

  @ViewChild('photosModal') photosModal!: Step232PhotosModal;

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
    const savedData = this.formStorage.getStepData('step2-3-1');
    if (savedData?.photos) {
      this.photos = savedData.photos;
    }
  }

  private saveFormData() {
    const data = {
      photos: this.photos,
      isValid: true  // Always valid to allow proceeding
    };
    this.formStorage.saveFormData('step2-3-1', data);
    this.validationService.validateStep('step2-3-1-add-photos');
  }

  openPhotosModal(): void {
    this.photosModal.openModal();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropzoneHighlight = false;
    if (event.dataTransfer?.files) {
      this.openPhotosModal();
    }
  }
}
