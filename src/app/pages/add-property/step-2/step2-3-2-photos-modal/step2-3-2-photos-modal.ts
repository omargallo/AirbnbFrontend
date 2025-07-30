import { Component } from '@angular/core';
// ...existing code...
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';

@Component({
  selector: 'app-step2-3-2-photos-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step2-3-2-photos-modal.html',
  styleUrl: './step2-3-2-photos-modal.css'
})
export class Step232PhotosModal {
  isModalOpen: boolean = false;
  hasUploadedPhotos: boolean = false;
  imageFiles: File[] = [];
  imagePreviews: { url: string; isCover: boolean }[] = [];

  constructor(
    private router: Router,
    private formStorage: PropertyFormStorageService
  ) { }

  onFilesSelected(event: Event): void {
    console.log('🖼️ Files selected event triggered');
    
    const input = event.target as HTMLInputElement;
    if (!input?.files) {
      console.log('❌ No files in input');
      return;
    }

    const files = Array.from(input.files);
    console.log(`📁 Selected ${files.length} files:`, files.map(f => ({ name: f.name, size: f.size, type: f.type })));

    this.imageFiles = [];
    this.imagePreviews = [];

    files.forEach((file, index) => {
      console.log(`Processing file ${index}:`, file.name, file.type);
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        this.imageFiles.push(file);
        this.imagePreviews.push({
          url,
          isCover: index === 0
        });
        console.log(`✅ Added image ${index}: ${file.name}`);
      } else {
        console.log(`❌ Skipped non-image file: ${file.name}`);
      }
    });

    console.log(`📷 Final arrays:`);
    console.log(`  - imageFiles count: ${this.imageFiles.length}`);
    console.log(`  - imagePreviews count: ${this.imagePreviews.length}`);

    const dataToSave = {
      imageFiles: this.imageFiles,
      images: this.imagePreviews,
      coverIndex: 0
    };

    console.log('💾 Saving data to storage:', dataToSave);
    
    this.formStorage.saveFormData('step2-3', dataToSave);

    const savedData = this.formStorage.getStepData('step2-3');
    console.log('✅ Data verification after save:', savedData);
    
    if (savedData && savedData.imageFiles && savedData.imageFiles.length > 0) {
      console.log(`✅ Successfully saved ${savedData.imageFiles.length} images`);
    } else {
      console.error('❌ Failed to save images properly!');
    }

    this.hasUploadedPhotos = this.imageFiles.length > 0;

    // Navigate to next step
    console.log('🧭 Navigating to photos-ta-da...');
    this.router.navigate(['/listing-wizard/step2-3-3-photos-ta-da']);
  }

  checkStoredData(): void {
    console.log('🔍 Checking stored data...');
    const step23Data = this.formStorage.getStepData('step2-3');
    console.log('Step 2-3 data:', step23Data);
    
    if (step23Data?.imageFiles) {
      console.log(`Found ${step23Data.imageFiles.length} stored images`);
    } else {
      console.log('No images found in storage');
    }
  }

  openModal(): void {
    this.isModalOpen = true;
    this.checkStoredData();
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  removePhoto(index: number): void {
    console.log(`🗑️ Removing photo at index ${index}`);
    
    if (index >= 0 && index < this.imageFiles.length) {
      const removedFile = this.imageFiles[index];
      const removedPreview = this.imagePreviews[index];
      
      // Clean up object URL to prevent memory leaks
      if (removedPreview?.url) {
        URL.revokeObjectURL(removedPreview.url);
      }
      
      this.imageFiles.splice(index, 1);
      this.imagePreviews.splice(index, 1);
      
      console.log(`✅ Removed ${removedFile.name}, remaining: ${this.imageFiles.length}`);
      
      // Update storage
      const dataToSave = {
        imageFiles: this.imageFiles,
        images: this.imagePreviews,
        coverIndex: 0
      };
      
      this.formStorage.saveFormData('step2-3', dataToSave);
      this.hasUploadedPhotos = this.imageFiles.length > 0;
    }
  }

  continueToTaDa(): void {
    console.log('➡️ Continue to Ta-Da clicked');
    this.checkStoredData();
    this.closeModal();
    this.router.navigate(['/listing-wizard/step2-3-3-photos-ta-da']);
  }
}