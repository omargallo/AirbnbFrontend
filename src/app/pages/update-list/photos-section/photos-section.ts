import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { PropertyService } from '../../../core/services/Property/property.service';
import { PropertyImage } from '../../../core/models/PropertyImage';

export interface PhotosSectionData {
  photos: PropertyImage[];
  propertyId: number;
  hostId: string;
}

@Component({
  selector: 'app-photos-section',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../update-list.css'],
  template: `
    <div class="section-content">
      <div class="section-header">
        <h2>Add some photos of your house</h2>
        <p>You'll need 5 photos to get started. You can add more or make changes later.</p>
      </div>
      
      <!-- Upload Status -->
      <div *ngIf="uploading" class="upload-status">
        <div class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="uploadProgress"></div>
          </div>
          <span class="progress-text">Uploading... {{uploadProgress}}%</span>
        </div>
      </div>
      
      <div class="photos-grid">
        <!-- Existing Property Photos -->
        <div class="photo-item" *ngFor="let photo of internalData?.photos; let i = index">
          <div class="photo-wrapper">
            <img [src]="baseUrl + '/' + photo.imageUrl" [alt]="'Property photo ' + (i + 1)" class="photo-image" 
                 onerror="this.src='assets/placeholder-image.jpg'">
          </div>
        </div>

        <!-- Preview Selected Files (before upload) -->
        <div class="photo-item" *ngFor="let file of selectedFiles; let i = index">
          <div class="photo-wrapper preview-photo">
            <img [src]="getPreviewUrl(file)" [alt]="'Preview ' + (i + 1)" class="photo-image">
            <button type="button" class="photo-remove-btn" (click)="removeSelectedFile(i)">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </button>
            <div class="preview-badge">Preview</div>
          </div>
        </div>
        
        <!-- Add Photo Button -->
        <div class="photo-item">
          <div class="add-photo-btn" (click)="photoInput.click()">
            <div class="add-photo-content">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              <span>Add photos</span>
              <small *ngIf="selectedFiles.length > 0">({{selectedFiles.length}} selected)</small>
            </div>
          </div>
          <input 
            type="file" 
            #photoInput 
            (change)="onFilesSelected($event)" 
            accept="image/*" 
            multiple 
            class="d-none">
        </div>
      </div>

      <!-- Upload Selected Files Button -->
      <div *ngIf="selectedFiles.length > 0" class="upload-section">
        <button
          type="button"
          class="upload-selected-btn"
          [disabled]="uploading"
          (click)="uploadSelectedPhotos()">
          <span *ngIf="uploading" class="spinner">⏳</span>
          <span *ngIf="!uploading">Upload {{selectedFiles.length}} Photo{{selectedFiles.length > 1 ? 's' : ''}}</span>
        </button>
        <button
          type="button"
          class="clear-selected-btn"
          [disabled]="uploading"
          (click)="clearSelectedFiles()">
          Clear Selection
        </button>
      </div>

      <!-- Photo Requirements -->
      <div class="photo-requirements" *ngIf="getTotalPhotoCount() < 5">
        <div class="requirement-item">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
          <span>You need {{5 - getTotalPhotoCount()}} more photo{{5 - getTotalPhotoCount() > 1 ? 's' : ''}} to continue</span>
        </div>
      </div>
    </div>
  `
})
export class PhotosSectionComponent implements OnInit, OnDestroy {
  @Input() data: PhotosSectionData | null = null;
  @Output() dataChange = new EventEmitter<PhotosSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() saveComplete = new EventEmitter<void>();
  @Output() validationChange = new EventEmitter<boolean>();


  internalData: PhotosSectionData | null = null;
  selectedFiles: File[] = [];
  uploadProgress: number = 0;
  uploading: boolean = false;
  baseUrl = environment.base;
  private previewUrls: Map<File, string> = new Map();

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    if (this.data) {
      this.internalData = { ...this.data };
      this.loadPropertyImages(); 
    }
    
    this.validationChange.emit(true);
  }

  ngOnDestroy(): void {
    this.selectedFiles.forEach(file => {
      const url = this.previewUrls.get(file);
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
    this.previewUrls.clear();
  }

  onFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    this.selectedFiles = [...this.selectedFiles, ...imageFiles];
    
    imageFiles.forEach(file => {
      if (!this.previewUrls.has(file)) {
        this.previewUrls.set(file, URL.createObjectURL(file));
      }
    });

    const maxPhotos = 20;
    const currentPhotos = this.internalData?.photos?.length || 0;
    const totalPhotos = currentPhotos + this.selectedFiles.length;

    if (totalPhotos > maxPhotos) {
      const allowedNew = maxPhotos - currentPhotos;
      const removedFiles = this.selectedFiles.splice(allowedNew);

      removedFiles.forEach(file => {
        const url = this.previewUrls.get(file);
        if (url) {
          URL.revokeObjectURL(url);
          this.previewUrls.delete(file);
        }
      });

      console.warn(`Maximum ${maxPhotos} photos allowed`);
    }

    // Emit changes
    this.updateHasChanges();
    event.target.value = '';
  }

  getPreviewUrl(file: File): string {
    if (!this.previewUrls.has(file)) {
      this.previewUrls.set(file, URL.createObjectURL(file));
    }
    return this.previewUrls.get(file)!;
  }

  removeSelectedFile(index: number) {
    const file = this.selectedFiles[index];
    const url = this.previewUrls.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      this.previewUrls.delete(file);
    }
    this.selectedFiles.splice(index, 1);
    this.updateHasChanges();
  }

  clearSelectedFiles() {
    this.selectedFiles.forEach(file => {
      const url = this.previewUrls.get(file);
      if (url) {
        URL.revokeObjectURL(url);
        this.previewUrls.delete(file);
      }
    });
    this.selectedFiles = [];
    this.updateHasChanges();
  }

  private updateHasChanges() {
    this.hasChanges.emit(this.selectedFiles.length > 0);
  }

  uploadSelectedPhotos() {
    if (this.selectedFiles.length === 0 || !this.internalData) return;

    const formData = new FormData();

    // Validate and append files
    this.selectedFiles.forEach((file) => {
      if (file.size === 0 || file.size > 10 * 1024 * 1024 || !file.type.startsWith('image/')) {
        console.error('Invalid file:', file.name);
        return;
      }
      formData.append('Files', file, file.name);
    });

    // Add required parameters
    formData.append('HostId', this.internalData.hostId || '');
    formData.append('PropertyId', String(this.internalData.propertyId) || '1');
    formData.append('GroupName', 'dsah');
    formData.append('CoverIndex', '2');

    console.log('Uploading files for property:', this.internalData.propertyId);

    this.uploading = true;
    this.uploadProgress = 0;

    this.propertyService.uploadPhotos(formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload successful!', event.body);
          
          // Clear selected files
          this.clearSelectedFiles();
          this.uploading = false;
          this.uploadProgress = 0;
          
          // Notify parent that save is complete
          this.saveComplete.emit();
          
          // Reload images to get updated list
          this.loadPropertyImages();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Upload failed:', error);
        this.uploading = false;
        this.uploadProgress = 0;
        
        let errorMessage = 'Upload failed';
        if (error.status === 400 && error.error?.errors) {
          const validationErrors = error.error.errors;
          errorMessage = Object.values(validationErrors).flat().join(', ');
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        alert(`Upload Error: ${errorMessage}`);
      }
    });
  }

  private loadPropertyImages() {
    if (this.internalData?.propertyId) {
      console.log('Loading images for property:', this.internalData.propertyId);
      
      this.propertyService.getImagesByPropertyId(this.internalData.propertyId).subscribe({
        next: (images) => {
          console.log('Loaded images:', images);
          
          if (this.internalData) {
            this.internalData.photos = images;
            
            // Emit the updated data to parent
            this.dataChange.emit({ ...this.internalData });
          }
        },
        error: (err) => {
          console.error('Failed to reload images:', err);
        }
      });
    }
  }

  getTotalPhotoCount(): number {
    const existingPhotos = this.internalData?.photos?.length || 0;
    const selectedPhotos = this.selectedFiles.length;
    return existingPhotos + selectedPhotos;
  }

  // Method to handle external save trigger (called by parent)
  handleSave(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.selectedFiles.length > 0) {
        // Subscribe to save completion
        const saveSubscription = this.saveComplete.subscribe(() => {
          saveSubscription.unsubscribe();
          resolve();
        });

        // Start upload
        this.uploadSelectedPhotos();
      } else {
        // No changes to save
        resolve();
      }
    });
  }
} 

