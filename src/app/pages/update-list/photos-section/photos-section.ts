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
  templateUrl: './photos-section.html',
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
  deleting: boolean = false;
  baseUrl = environment.base;
  private previewUrls: Map<File, string> = new Map();
  
  // Track images to be deleted
  imagesToDelete: Set<number> = new Set();
  deleteMode: boolean = false;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    if (this.data) {
      this.internalData = { ...this.data };
      this.loadPropertyImages().catch(error => {
        console.error('Failed to load initial images:', error);
      });
    }
    
    // Initial validation check
    this.updateValidation();
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

  // Method to check if section is valid (has at least 5 photos)
  private updateValidation(): void {
    const totalPhotos = this.getTotalPhotoCount();
    const isValid = totalPhotos >= 5;
    this.validationChange.emit(isValid);
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

    // Emit changes and validation
    this.updateHasChanges();
    this.updateValidation();
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
    this.updateValidation();
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
    this.updateValidation();
  }

  // Toggle delete mode
  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    if (!this.deleteMode) {
      this.imagesToDelete.clear();
      this.updateHasChanges();
      this.updateValidation();
    }
  }

  // Toggle image selection for deletion
  toggleImageForDeletion(imageId: number) {
    if (this.imagesToDelete.has(imageId)) {
      this.imagesToDelete.delete(imageId);
    } else {
      this.imagesToDelete.add(imageId);
    }
    this.updateHasChanges();
    this.updateValidation();
  }

  // Check if image is selected for deletion
  isImageSelectedForDeletion(imageId: number): boolean {
    return this.imagesToDelete.has(imageId);
  }

  // Delete selected images
  deleteSelectedImages() {
    if (this.imagesToDelete.size === 0 || !this.internalData) return;

    const imageIds = Array.from(this.imagesToDelete);
    
    // Check minimum images considering the 5 image requirement
    const remainingImages = (this.internalData.photos?.length || 0) - imageIds.length;
    if (remainingImages < 5) {
      alert('You must keep at least 5 photos for your property.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${imageIds.length} image(s)?`)) {
      return;
    }

    this.deleting = true;

    this.propertyService.deletePropertyImages(this.internalData.propertyId, imageIds).subscribe({
      next: (result) => {
        console.log('Delete response:', result);
        
        if (result && result.isSuccess === true) {
          console.log('Images deleted successfully');
          
          // Remove deleted images from local data
          if (this.internalData?.photos) {
            this.internalData.photos = this.internalData.photos.filter(
              photo => !this.imagesToDelete.has(photo.id)
            );
          }
          
          // Clear selection and exit delete mode
          this.imagesToDelete.clear();
          this.deleteMode = false;
          this.deleting = false;
          
          // Emit updated data
          this.dataChange.emit({ ...this.internalData! });
          this.saveComplete.emit();
          this.updateHasChanges();
          this.updateValidation();
          
        } else {
          const message = result?.message || 'Delete operation failed';
          console.error('Delete failed:', message);
          alert(`Delete failed: ${message}`);
          this.deleting = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Delete error:', error);
        this.deleting = false;
        
        let errorMessage = 'Failed to delete images';
        
        if (error.status === 204) {
          console.log('Delete successful (204 No Content)');
          
          // Remove deleted images from local data
          if (this.internalData?.photos) {
            this.internalData.photos = this.internalData.photos.filter(
              photo => !this.imagesToDelete.has(photo.id)
            );
          }
          
          // Clear selection and exit delete mode
          this.imagesToDelete.clear();
          this.deleteMode = false;
          this.deleting = false;
          
          // Emit updated data
          this.dataChange.emit({ ...this.internalData! });
          this.saveComplete.emit();
          this.updateHasChanges();
          this.updateValidation();
          return;
        }
        
        // Handle other error cases
        if (error.status === 401) {
          errorMessage = 'Unauthorized: You don\'t have permission to delete these images';
        } else if (error.status === 404) {
          errorMessage = 'Images not found';
        } else if (error.status === 400) {
          errorMessage = 'Bad request: Invalid image IDs or property ID';
        } else if (error.status === 500) {
          errorMessage = 'Server error: Please try again later';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        alert(`Delete Error: ${errorMessage}`);
      }
    });
  }

  private updateHasChanges() {
    const hasNewFiles = this.selectedFiles.length > 0;
    const hasDeletedImages = this.imagesToDelete.size > 0;
    this.hasChanges.emit(hasNewFiles || hasDeletedImages);
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
          
          // Clear selected files first
          this.clearSelectedFiles();
          this.uploading = false;
          this.uploadProgress = 0;
          
          // FIXED: Wait for image reload to complete before emitting saveComplete
          this.loadPropertyImages().then(() => {
            // Only emit saveComplete after images are reloaded
            this.saveComplete.emit();
          }).catch((error) => {
            console.error('Failed to reload images after upload:', error);
            // Still emit saveComplete even if reload fails to prevent hanging
            this.saveComplete.emit();
          });
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

  // UPDATED: Make loadPropertyImages return a Promise
  private loadPropertyImages(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.internalData?.propertyId) {
        console.log('Loading images for property:', this.internalData.propertyId);
        
        this.propertyService.getImagesByPropertyId(this.internalData.propertyId).subscribe({
          next: (images) => {
            console.log('Loaded images:', images);
            
            if (this.internalData) {
              this.internalData.photos = images;
              
              // Emit the updated data to parent
              this.dataChange.emit({ ...this.internalData });
              
              // Check validation after loading images
              this.updateValidation();
            }
            
            resolve(); // Resolve the promise when images are loaded
          },
          error: (err) => {
            console.error('Failed to reload images:', err);
            reject(err); // Reject the promise on error
          }
        });
      } else {
        resolve(); // Resolve immediately if no property ID
      }
    });
  }

  getTotalPhotoCount(): number {
    const existingPhotos = (this.internalData?.photos?.length || 0) - this.imagesToDelete.size;
    const selectedPhotos = this.selectedFiles.length;
    return existingPhotos + selectedPhotos;
  }

  // Method to handle external save trigger (called by parent)
  handleSave(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check validation before saving
      if (this.getTotalPhotoCount() < 5) {
        reject(new Error('At least 5 photos are required'));
        return;
      }

      const hasUploads = this.selectedFiles.length > 0;
      const hasDeletes = this.imagesToDelete.size > 0;

      if (hasUploads && hasDeletes) {
        // Handle both uploads and deletes
        this.deleteSelectedImages();
        const deleteSubscription = this.saveComplete.subscribe(() => {
          deleteSubscription.unsubscribe();
          
          // After delete, do upload
          const uploadSubscription = this.saveComplete.subscribe(() => {
            uploadSubscription.unsubscribe();
            resolve();
          });
          this.uploadSelectedPhotos();
        });
      } else if (hasDeletes) {
        // Only deletes
        const deleteSubscription = this.saveComplete.subscribe(() => {
          deleteSubscription.unsubscribe();
          resolve();
        });
        this.deleteSelectedImages();
      } else if (hasUploads) {
        // Only uploads
        const uploadSubscription = this.saveComplete.subscribe(() => {
          uploadSubscription.unsubscribe();
          resolve();
        });
        this.uploadSelectedPhotos();
      } else {
        // No changes
        resolve();
      }
    });
  }
}