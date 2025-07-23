import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PropertyService } from '../../core/services/Property/property.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';

export interface Property {
  id: string;
  title: string;
  hostId:string;
  description: string;
  propertyType: string;
  price: number;
  maxGuests: number;
  photos: string[];
  amenities: string[];
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  updatedAt?: Date;
}

export interface MenuSection {
  id: keyof Property | 'photos' | 'amenities' | 'location';
  label: string;
  icon: string;
  isActive: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  lastSaved?: Date;
}

@Component({
  selector: 'app-update-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-list.html',
  styleUrls: ['./update-list.css']
})
export class UpdateList implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  property: Property | null = null;
  propertyForm!: FormGroup;
  isLoading = false;
  hasUnsavedChanges = false;
  selectedFiles:File[] =[]
  uploadProgress:number = 0
  uploading:boolean= false

  menuSections: MenuSection[] = [
    { id: 'photos', label: 'Photos', icon: '📸', isActive: true, hasChanges: false, isSaving: false },
    { id: 'title', label: 'Title', icon: '📝', isActive: false, hasChanges: false, isSaving: false },
    { id: 'propertyType', label: 'Property type', icon: '🏠', isActive: false, hasChanges: false, isSaving: false },
    { id: 'price', label: 'Pricing', icon: '💰', isActive: false, hasChanges: false, isSaving: false },
    { id: 'maxGuests', label: 'Guests', icon: '👥', isActive: false, hasChanges: false, isSaving: false },
    { id: 'description', label: 'Description', icon: '📄', isActive: false, hasChanges: false, isSaving: false },
    { id: 'amenities', label: 'Amenities', icon: '✨', isActive: false, hasChanges: false, isSaving: false },
    { id: 'location', label: 'Location', icon: '📍', isActive: false, hasChanges: false, isSaving: false }
  ];

  activeSection: string = 'photos';

  propertyTypes = [
    'House', 'Apartment', 'Condo', 'Villa', 'Townhouse',
    'Cabin', 'Loft', 'Studio', 'Guesthouse', 'Hotel'
  ];

  availableAmenities = [
    'Wifi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning',
    'Heating', 'Dedicated workspace', 'TV', 'Hair dryer', 'Iron',
    'Pool', 'Hot tub', 'Free parking', 'EV charger', 'Crib',
    'Gym', 'BBQ grill', 'Breakfast', 'Indoor fireplace', 'Smoking allowed',
    'Pets allowed', 'Party or event friendly', 'Camera/recording device'
  ];

  // Guest icons array - different poses/types of people icons
 guestIcons = [
  
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/354bca63-8008-45d7-b76f-c1c19a788825.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/5a0d9cb7-0aea-44e9-a61a-017685c6d2d0.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/244dc498-e875-449e-b855-5d13b8f44d50.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/70da4d82-9182-4edf-a4ef-97326fcfdd0b.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/48b87e37-cd4a-4a56-9422-79e278764b6e.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/bd44136d-ddda-4f3e-916c-3dcc816e5fa5.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/708f660d-443a-4283-9c36-484029accd65.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/84572734-6766-47a9-9fb8-f7ee9a70f63a.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/8b0a737b-2c87-43b6-a4a2-dce4ebcb1bdf.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/2a8e78db-8781-4bc7-a746-bef45ed6aed9.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/701cd29e-3c5e-4055-b54f-2ced17b792d6.png',
  'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/50f7cb91-d0fe-4726-963c-7242660b1db3.png'
];
  constructor(
    private fb: FormBuilder,
    private propService:PropertyService,
    private cdr: ChangeDetectorRef

  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProperty();
    this.setupFormChangeTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPropertyImages(){

  }
  trackBySection(index: number, section: MenuSection): string {
    return section.id as string;
  }

  private initializeForm(): void {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      propertyType: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      maxGuests: [1, [Validators.required, Validators.min(1), Validators.max(16)]],
      photos: [[]],
      amenities: [[]],
      location: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      })
    });
  }

  private setupFormChangeTracking(): void {
    Object.keys(this.propertyForm.controls).forEach(key => {
      this.propertyForm.get(key)?.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.updateSectionChangeStatus(key);
        });
    });
  }

  private updateSectionChangeStatus(sectionId: string): void {
    const section = this.menuSections.find(s => s.id === sectionId);
    if(section?.id == "photos")
    {
      section.hasChanges = this.selectedFiles.length > 0
    }
    else if (section && this.property) {
      const formValue = this.propertyForm.get(sectionId)?.value;
      const originalValue = this.property[sectionId as keyof Property];
      
      if (sectionId === 'location') {
        section.hasChanges = JSON.stringify(formValue) !== JSON.stringify(originalValue);
      } else if (Array.isArray(formValue)) {
        section.hasChanges = JSON.stringify(formValue) !== JSON.stringify(originalValue);
      } else {
        section.hasChanges = formValue !== originalValue;
      }
    }
  }

  private loadProperty(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.property = {
        id: '1',
        hostId: "5a6c3d4f-9ca1-4b58-bdf6-a6e19b62218f",
        title: 'Cozy and good',
        description: 'A beautiful space with all the amenities you need for a comfortable stay.',
        propertyType: 'Apartment',
        price: 120,
        maxGuests: 1,
        photos: [
          
        ],
        amenities: ['Wifi', 'Kitchen', 'Washer', 'Air conditioning'],
        location: {
          address: '123 Main Street',
          city: 'San Francisco',
          country: 'United States'
        }
      };

      this.populateForm();
      this.isLoading = false;
    }, 800);
  }

  private populateForm(): void {
    if (this.property) {
      this.propertyForm.patchValue(this.property);
      this.menuSections.forEach(section => {
        section.hasChanges = false;
        section.isSaving = false;
      });
    }
  }

  onMenuSectionClick(section: MenuSection): void {
    this.menuSections.forEach(s => s.isActive = false);
    section.isActive = true;
    this.activeSection = section.id as string;
  }

  onSaveCurrentSection(): void {
    const activeSection = this.getActiveSectionObject();
    if (activeSection) {
      this.onSaveSection(activeSection);
    }
  }

  onSaveSection(section: MenuSection): void {
    if (!section.hasChanges || section.isSaving) return;

    console.log("onSaveSection");
    section.isSaving = true;
    const sectionData = this.getSectionData(section.id as string);

    setTimeout(() => {
      let promise =  this.saveSectionToAPI(section.id as string, sectionData)
        if(!promise)
          return
        promise.then(() => {
          section.hasChanges = false;
          section.isSaving = false;
          section.lastSaved = new Date();
          
          if (this.property) {
            if (section.id === 'location') {
              this.property.location = { ...sectionData };
            } else {
              (this.property as any)[section.id] = sectionData;
            }
          }
        })
        .catch((error) => {
          section.isSaving = false;
          console.error(`Error saving ${section.id}:`, error);
        });
    }, 1000);
  }

  private getSectionData( sectionId: string): any {
    return this.propertyForm.get(sectionId)?.value;
  }

  private async saveSectionToAPI(sectionId: string, data: any): Promise<void> {
    const endpoints = {
      photos: '/api/properties/photos',
      title: '/api/properties/title',
      propertyType: '/api/properties/type',
      price: '/api/properties/pricing',
      maxGuests: '/api/properties/guests',
      description: '/api/properties/description',
      amenities: '/api/properties/amenities',
      location: '/api/properties/location'
    };
    if(sectionId == "photos"){
      this.uploadSelectedPhotos()
      return
    }
    console.log(`Saving ${sectionId} to ${endpoints[sectionId as keyof typeof endpoints]}:`, data);
    
    return new Promise((resolve) => {
      resolve();
    });
  }
// Add this property to your component
private previewUrls: Map<File, string> = new Map();

// Replace the getPreviewUrl method with this cached version
getPreviewUrl(file: File): string {
  if (!this.previewUrls.has(file)) {
    this.previewUrls.set(file, URL.createObjectURL(file));
  }
  return this.previewUrls.get(file)!;
}

// Update the file selection method
onFilesSelected(event: any) {
  console.log("Host and prop Id",this.property?.id, this.property?.hostId)

  const files = Array.from(event.target.files) as File[];
  
  // Filter only image files
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  // Add to existing selection
  this.selectedFiles = [...this.selectedFiles, ...imageFiles];
  
  // Pre-generate URLs for new files
  imageFiles.forEach(file => {
    if (!this.previewUrls.has(file)) {
      this.previewUrls.set(file, URL.createObjectURL(file));
    }
  });
  
  // Optional: Limit total photos
  const maxPhotos = 20;
  const currentPhotos = this.propertyForm.get('photos')?.value?.length || 0;
  const totalPhotos = currentPhotos + this.selectedFiles.length;
  
  if (totalPhotos > maxPhotos) {
    const allowedNew = maxPhotos - currentPhotos;
    const removedFiles = this.selectedFiles.splice(allowedNew);
    
    // Clean up URLs for removed files
    removedFiles.forEach(file => {
      const url = this.previewUrls.get(file);
      if (url) {
        URL.revokeObjectURL(url);
        this.previewUrls.delete(file);
      }
    });
    
    console.warn(`Maximum ${maxPhotos} photos allowed`);
  }

  if(this.selectedFiles.length>0){
    let section  = this.menuSections.find(s=> s.id == "photos")
    if(section)
      section.hasChanges = true
  }
  
  // Clear the input
  event.target.value = '';
}

// Update the remove selected file method
removeSelectedFile(index: number) {
  const file = this.selectedFiles[index];
  
  // Clean up blob URL
  const url = this.previewUrls.get(file);
  if (url) {
    URL.revokeObjectURL(url);
    this.previewUrls.delete(file);
  }
  
  this.selectedFiles.splice(index, 1);
}

// Update the clear selected files method
clearSelectedFiles() {
  // Clean up all blob URLs
  this.selectedFiles.forEach(file => {
    const url = this.previewUrls.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      this.previewUrls.delete(file);
    }
  });
  this.selectedFiles = [];
}

// Update the upload method to clean up URLs after successful upload
// Updated upload method with better error handling and debugging
uploadSelectedPhotos() {
  if (this.selectedFiles.length === 0) return;

  const formData = new FormData();
  
  // Debug: Log what we're about to send
  console.log('Uploading files:', this.selectedFiles.map(f => ({
    name: f.name,
    size: f.size,
    type: f.type
  })));

  // Append each file with validation
  this.selectedFiles.forEach((fileObj, index) => {
    const file = fileObj;
    
    // Validate file before adding
    if (file.size === 0) {
      console.error(`File ${file.name} is empty`);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      console.error(`File ${file.name} is too large: ${file.size} bytes`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      console.error(`File ${file.name} is not an image: ${file.type}`);
      return;
    }
    
    // Server might expect specific parameter names - try different variations:
    formData.append('Files', file, file.name); // Note capital 'F'
    // OR try: formData.append('files', file, file.name);
    // OR try: formData.append('images', file, file.name);
  });

  // Add required parameters - check what your API expects
  // Common parameter names:
  formData.append('HostId', this.property?.hostId  || ''); // Make sure this exists and is valid
  formData.append('PropertyId', this.property?.id || '1');
  formData.append('GroupName', 'dsah');
  formData.append('CoverIndex', '2');

  
  // Debug: Log FormData contents
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  this.uploading = true;
  this.uploadProgress = 0;
  // Updated API call with better error handling
  this.propService.uploadPhotos(formData).subscribe({
    next: (event) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        this.uploadProgress = Math.round(100 * event.loaded / event.total);
      } else if (event.type === HttpEventType.Response) {
        console.log('Upload successful!', event.body);
        const uploadedUrls = event.body as string[];
        console.log(uploadedUrls,event)
        console.log("success")
        
        this.clearSelectedFiles();
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
    error: (error: HttpErrorResponse) => {
      console.error('Upload failed:', error);
      
      // Enhanced error handling
      if (error.status === 400 && error.error) {
        const validationErrors = error.error.errors;
        console.error('Validation errors:', validationErrors);
        
        // Show specific error messages to user
        let errorMessage = 'Upload failed:\n';
        
        if (validationErrors.Files) {
          errorMessage += `Files: ${validationErrors.Files.join(', ')}\n`;
        }
        
        if (validationErrors.HostId) {
          errorMessage += `HostId: ${validationErrors.HostId.join(', ')}\n`;
        }
        
        // Display error to user (replace with your notification system)
        alert(errorMessage);
        // Or use: this.showErrorMessage(errorMessage);
      } else {
        // Generic error handling
        alert(`Upload failed: ${error.message}`);
      }
      
      this.uploading = false;
      this.uploadProgress = 0;
    }
  });
}

// Alternative method to check server requirements first
// async checkServerRequirements() {
//   try {
//     // If your API has an endpoint to check upload requirements
//     const response = await this.http.get('/api/Property/upload-requirements').toPromise();
//     console.log('Server upload requirements:', response);
//   } catch (error) {
//     console.log('Could not fetch server requirements');
//   }
// }

// Method to validate files before upload
validateFilesBeforeUpload(): boolean {
  const errors: string[] = [];
  
  // Check if we have files
  if (this.selectedFiles.length === 0) {
    errors.push('No files selected');
  }
  
  // Check required parameters
  if (!this.property?.id && !this.property?.hostId) {
    errors.push('Property ID or Host ID is required');
  }
  
  // Validate each file
  this.selectedFiles.forEach((fileObj, index) => {
    const file = fileObj;
    
    if (file.size === 0) {
      errors.push(`File ${index + 1} (${file.name}) is empty`);
    }
    
    if (file.size > 10 * 1024 * 1024) {
      errors.push(`File ${index + 1} (${file.name}) is too large (max 10MB)`);
    }
    
    if (!file.type.startsWith('image/')) {
      errors.push(`File ${index + 1} (${file.name}) is not an image`);
    }
    
    // Check supported formats
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      errors.push(`File ${index + 1} (${file.name}) format not supported. Use JPG, PNG, or WebP`);
    }
  });
  
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    alert('Validation errors:\n' + errors.join('\n'));
    return false;
  }
  
  return true;
}

// Updated upload method with validation
uploadSelectedPhotosWithValidation() {
  if (!this.validateFilesBeforeUpload()) {
    return;
  }
  
  this.uploadSelectedPhotos();
}

// Remove existing photo from form
// onPhotoRemove(index: number) {
//   const currentPhotos = this.propertyForm.get('photos')?.value || [];
//   currentPhotos.splice(index, 1);
//   this.propertyForm.patchValue({ photos: currentPhotos });
// }

// Get total photo count (existing + selected)
getTotalPhotoCount(): number {
  const existingPhotos = this.propertyForm.get('photos')?.value?.length || 0;

  const selectedPhotos = this.selectedFiles.length;
  console.log("from getTotalPhotoCount ", existingPhotos+ selectedPhotos)
  return existingPhotos + selectedPhotos;
}
  // oH

  onPhotoRemove(index: number): void {
    const currentPhotos = this.propertyForm.get('photos')?.value || [];
    currentPhotos.splice(index, 1);
    this.propertyForm.patchValue({ photos: [...currentPhotos] });
  }

  onAmenityToggle(amenity: string): void {
    const currentAmenities = this.propertyForm.get('amenities')?.value || [];
    const index = currentAmenities.indexOf(amenity);

    if (index > -1) {
      currentAmenities.splice(index, 1);
    } else {
      currentAmenities.push(amenity);
    }

    this.propertyForm.patchValue({ amenities: [...currentAmenities] });
  }

  isAmenitySelected(amenity: string): boolean {
    const currentAmenities = this.propertyForm.get('amenities')?.value || [];
    return currentAmenities.includes(amenity);
  }

  getFieldError(fieldName: string): string {
    const field = this.propertyForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `This field is required`;
      if (field.errors['maxlength']) return `Too long`;
      if (field.errors['min']) return `Must be at least 1`;
      if (field.errors['max']) return `Maximum exceeded`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.propertyForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getActiveSectionObject(): MenuSection | undefined {
    return this.menuSections.find(section => section.isActive);
  }

  hasChangesInActiveSection(): boolean {
    const activeSection = this.getActiveSectionObject();
    console.log("from hasChangesInActiveSection",activeSection)
    return activeSection?.hasChanges || false;
  }

  isSavingActiveSection(): boolean {
    const activeSection = this.getActiveSectionObject();
    return activeSection?.isSaving || false;
  }

  getSaveButtonText(): string {
    if (this.isSavingActiveSection()) {
      return '';
    }
    const activeSection = this.getActiveSectionObject();
    return activeSection?.lastSaved ? 'Saved' : 'Save';
  }

  getSaveButtonClass(): string {
    const activeSection = this.getActiveSectionObject();
    if (activeSection?.lastSaved && !activeSection.hasChanges) {
      return 'saved';
    }
    return '';
  }

  // New method to get guest icons based on current guest count
  getGuestIconsToShow(): string[] {
    const guestCount = this.propertyForm.get('maxGuests')?.value || 1;
    const iconsToShow: string[] = [];
    
    // Show icons up to the guest count, cycling through available icons
    for (let i = 0; i < guestCount && i < 16; i++) {
      const iconIndex = i % this.guestIcons.length;
      iconsToShow.push(this.guestIcons[iconIndex]);
    }
    
    return iconsToShow;
  }

  // Track by function for guest icons
  trackByGuestIcon(index: number, icon: string): string {
    return `${index}-${icon}`;
  }
}