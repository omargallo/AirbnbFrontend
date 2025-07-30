import { Injectable } from '@angular/core';
import { PropertyDisplayDTO } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyFormStorageService {
  private formData: { [key: string]: any } = {};
  private property: Partial<PropertyDisplayDTO> = {};

  private imageFiles: File[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  saveFormData(step: string, data: any): void {
    console.log(`💾 Saving data for step: ${step}`, data);

    if (step === 'step2-3' && data.imageFiles) {
      this.setImageFiles(data.imageFiles); 
    }

    const dataToStore = { ...data };
    delete dataToStore.imageFiles;

    this.formData[step] = dataToStore;
    this.updateProperty(step, data);

    this.saveToLocalStorage(); 

    console.log('📊 Current form data after save:', this.formData);
  }

  getStepData(step: string): any {
    const data = { ...this.formData[step] };

    if (step === 'step2-3') {
      data.imageFiles = this.getImageFiles(); 
    }

    console.log(`📖 Getting data for step: ${step}`, data);
    return data;
  }

  getFormData(): { [key: string]: any } {
    console.log('📋 Getting all form data:', this.formData);
    return this.formData;
  }

  debugFormData(): void {
    console.log('=== FORM DATA DEBUG ===');
    console.log('All steps:', Object.keys(this.formData));

    Object.keys(this.formData).forEach(step => {
      console.log(`Step ${step}:`, this.getStepData(step));
    });
  }

  private updateProperty(step: string, data: any): void {
    switch (step) {
      case 'step1-4-1':
        this.property.location = {
          latitude: data.latitude,
          longitude: data.longitude
        };
        this.property.address = data.address;
        break;
      case 'step2-3':
        if (data.imageFiles) {
          console.log('🖼️ Updating property with images:', data.imageFiles.length);
        }
        break;
    }
  }

  private saveToLocalStorage(): void {
    try {
      const serializableData: { [key: string]: any } = {};

      for (const key in this.formData) {
        if (key === 'step2-3') {
          const { images, coverIndex } = this.formData[key];
          serializableData[key] = { images, coverIndex }; 
        } else {
          serializableData[key] = this.formData[key];
        }
      }

      localStorage.setItem('property_form_data', JSON.stringify(serializableData));
      console.log('💾 Data saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('property_form_data');
      if (saved) {
        this.formData = JSON.parse(saved);

        if (this.formData['step2-3']?.images) {
          console.warn('⚠️ imageFiles not restorable from localStorage. Must re-select.');
        }

        console.log('📂 Data loaded from localStorage:', this.formData);
      }
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      this.formData = {};
    }
  }

  getPropertyData(): any {
    return this.property;
  }

  clearFormData(): void {
    console.log('🗑️ Clearing form data');
    this.formData = {};
    this.property = {};
    this.imageFiles = []; 
    localStorage.removeItem('property_form_data');
  }

  setImageFiles(files: File[]): void {
    this.imageFiles = files;
  }

  getImageFiles(): File[] {
    return this.imageFiles;
  }
  
}
