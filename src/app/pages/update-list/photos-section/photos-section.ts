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
  styleUrls: ['../update-list.css', './photos-section.css'],
templateUrl: './photos-section.html',})
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

