
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// ...existing code...
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { PropertyFormStorageService } from '../../../../core/services/ListingWizard/property-form-storage.service';
import { Subscription } from 'rxjs';

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
    // Load saved data
    const savedData = this.formStorage.getStepData('step2-3-3');
    if (savedData?.photos) {
      this.photos = savedData.photos;
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    const files = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.readFile(file);
      }
    }
    this.saveFormData();
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photos.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
    this.saveFormData();
  }

  onDragStart(index: number): void {
    this.dragStartIndex = index;
  }

  onDrop(index: number): void {
    if (this.dragStartIndex !== null && this.dragStartIndex !== index) {
      const movedPhoto = this.photos.splice(this.dragStartIndex, 1)[0];
      this.photos.splice(index, 0, movedPhoto);
      this.saveFormData();
    }
    this.dragStartIndex = null;
  }
}
