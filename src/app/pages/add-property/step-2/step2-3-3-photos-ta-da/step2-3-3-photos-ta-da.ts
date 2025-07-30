import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../../add-property/services/property-form-storage.service';

@Component({
  selector: 'app-step2-3-3-photos-ta-da',
  imports: [CommonModule],
  templateUrl: './step2-3-3-photos-ta-da.html',
  styleUrl: './step2-3-3-photos-ta-da.css'
})
export class Step233PhotosTaDa implements OnInit, OnDestroy {
  private subscription!: Subscription;
  photos: string[] = [];
  dragStartIndex: number | null = null;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService
  ) {}

  ngOnInit(): void {
    const savedData = this.formStorage.getStepData('step2-3-3');
    if (savedData?.photos) {
      this.photos = [...savedData.photos];
    }

    const imageFiles = this.formStorage.getImageFiles();
    imageFiles.forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      this.photos.push(objectUrl);
    });

    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Clean up object URLs
    this.photos.forEach(photo => {
      if (photo.startsWith('blob:')) {
        URL.revokeObjectURL(photo);
      }
    });
  }

  private saveFormData(): void {
    const data = {
      photos: this.photos
    };
    this.formStorage.saveFormData('step2-3-3', data);
  }

  addPhotos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input?.files) return;
    const files = Array.from(input.files);

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        this.photos.push(objectUrl);
        const currentFiles = this.formStorage.getImageFiles();
        this.formStorage.setImageFiles([...currentFiles, file]);
      }
    });

    this.saveFormData();
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);

    const currentFiles = this.formStorage.getImageFiles();
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);
    this.formStorage.setImageFiles(updatedFiles);

    this.saveFormData();
  }

  onDragStart(index: number): void {
    this.dragStartIndex = index;
  }

  onDrop(index: number): void {
    if (this.dragStartIndex !== null && this.dragStartIndex !== index) {
      const movedPhoto = this.photos.splice(this.dragStartIndex, 1)[0];
      this.photos.splice(index, 0, movedPhoto);

      const imageFiles = this.formStorage.getImageFiles();
      const movedFile = imageFiles.splice(this.dragStartIndex, 1)[0];
      imageFiles.splice(index, 0, movedFile);
      this.formStorage.setImageFiles(imageFiles);

      this.saveFormData();
    }
    this.dragStartIndex = null;
  }
}
