import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wizard-step-two', 
  templateUrl: './step-two.html',  
  styleUrls: ['./step-two.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class WizardStepTwoComponent {
  @Input() form!: FormGroup;

  amenities = [
    { id: 'wifi', name: 'Wifi', icon: '📶', essential: true },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', essential: true },
    { id: 'washer', name: 'Washer', icon: '🧺', essential: false },
    { id: 'dryer', name: 'Dryer', icon: '🌀', essential: false },
    { id: 'ac', name: 'Air conditioning', icon: '❄️', essential: true },
    { id: 'heating', name: 'Heating', icon: '🔥', essential: true },
    { id: 'workspace', name: 'Dedicated workspace', icon: '💻', essential: false },
    { id: 'tv', name: 'TV', icon: '📺', essential: false },
    { id: 'parking', name: 'Free parking on premises', icon: '🚗', essential: true },
    { id: 'pool', name: 'Pool', icon: '🏊', essential: false },
    { id: 'hot_tub', name: 'Hot tub', icon: '🛁', essential: false },
    { id: 'gym', name: 'Gym', icon: '💪', essential: false },
    { id: 'bbq', name: 'BBQ grill', icon: '🔥', essential: false },
    { id: 'outdoor_space', name: 'Patio or balcony', icon: '🌿', essential: false },
    { id: 'beach_access', name: 'Beach access', icon: '🏖️', essential: false },
    { id: 'ski_access', name: 'Ski-in/Ski-out', icon: '⛷️', essential: false }
  ];

  uploadedPhotos: any[] = [];
  dragActive = false;

  toggleAmenity(amenityId: string): void {
    const currentAmenities = this.form.get('amenities')?.value || [];
    let updatedAmenities;

    if (currentAmenities.includes(amenityId)) {
      updatedAmenities = currentAmenities.filter((id: string) => id !== amenityId);
    } else {
      updatedAmenities = [...currentAmenities, amenityId];
    }

    this.form.patchValue({ amenities: updatedAmenities });
  }

  isAmenitySelected(amenityId: string): boolean {
    const selectedAmenities = this.form.get('amenities')?.value || [];
    return selectedAmenities.includes(amenityId);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedPhotos.push({
            file,
            preview: e.target?.result,
            name: file.name
          });
          this.updateFormPhotos();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removePhoto(index: number): void {
    this.uploadedPhotos.splice(index, 1);
    this.updateFormPhotos();
  }

  updateFormPhotos(): void {
    this.form.patchValue({ photos: this.uploadedPhotos });
  }

  updateTitle(event: any): void {
    this.form.patchValue({ title: event.target.value });
  }

  updateDescription(event: any): void {
    this.form.patchValue({ description: event.target.value });
  }

  getEssentialAmenities() {
    return this.amenities.filter(amenity => amenity.essential);
  }

  getStandoutAmenities() {
    return this.amenities.filter(amenity => !amenity.essential);
  }
}