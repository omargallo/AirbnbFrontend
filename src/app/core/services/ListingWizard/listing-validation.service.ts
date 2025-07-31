import { Injectable } from '@angular/core';
import { PropertyFormStorageService } from '../../../pages/add-property/services/property-form-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingValidationService {
  private canProceedSubject = new BehaviorSubject<boolean>(true);
  canProceed$ = this.canProceedSubject.asObservable();

  constructor(private formStorage: PropertyFormStorageService) {}

  validateStep(stepRoute: string): boolean {
    const formData = this.formStorage.getFormData();
    let isValid = true;

    switch (stepRoute) {
      case 'step1-2-which-of':
        isValid = !!formData['step1-2']?.propertyTypeId;
        break;

      case 'step1-3-what-type':
        // Validate place type selection
        const whatTypeData = formData['step1-3'];
        isValid = !!whatTypeData?.selectedPlace;
        break;

      case 'step1-4-1-where':
        const coordinates = formData['step1-4-1']?.coordinates;
        isValid = !!(coordinates?.lat && coordinates?.lng);
        break;

      case 'step1-4-2-confirm-address':
        const addressData = formData['step1-4-2'];
        const hasZipcode = typeof addressData?.zipcode === 'string' || typeof addressData?.zipcode === 'number';
        let zipcodeStr = hasZipcode ? String(addressData.zipcode).replace(/[^0-9]/g, '') : '';
        const zipcodeLength = zipcodeStr.length;
        const isZipcodeValid = hasZipcode && zipcodeLength >= 3 && zipcodeLength <= 10;

        isValid = !!(
          addressData?.city?.trim() && 
          addressData?.country?.trim() && 
          addressData?.state?.trim() &&
          addressData?.street?.trim() &&
          isZipcodeValid
        );
        break;

      case 'step3-2':
        const step3BookingData = formData['step3-2'];
        isValid = !!step3BookingData?.selected;
        break;

      case 'step1-5-basic-about':
        const basicData = formData['step1-5'];
        isValid = !!(basicData?.guests && basicData?.bedrooms && basicData?.beds && basicData?.bathrooms);
        break;

      case 'step2-2-tell-guests':
        const amenities = formData['step2-2']?.selectedAmenityIds;
        isValid = !!(amenities && amenities.length > 0);
        break;

      case 'step2-3-1-add-photos':
        isValid = true; // Always valid to allow proceeding
        break;

      case 'step2-3-3-photos-ta-da':
        const photosTaDaData = formData['step2-3-3'];
        isValid = !!(photosTaDaData?.photos && photosTaDaData.photos.length >= 5);
        break;

      case 'step2-4-title':
        const title = formData['step2-4']?.title?.trim();
        isValid = !!(title && title.length >= 5 && title.length <= 20);
        break;

      case 'step2-6-description':
        const description = formData['step2-6']?.description;
        isValid = !!(description && description.length >= 50);
        break;

      case 'step3-2-pick-booking':
        // Validate booking settings selection
        const bookingData = formData['step3-2'];
        isValid = !!bookingData?.selected;
        break;

      case 'step3-3':
        // Validate welcome message selection
        const welcomeData = formData['step3-3'];
        isValid = !!welcomeData?.selected;
        this.canProceedSubject.next(isValid);
        break;

      case 'step3-4-1-pricing':
        // Always valid since we enforce minimum price in the component
        isValid = true;
        this.canProceedSubject.next(true);
        break;

      case 'step3-4-2':
        // Always valid since we want to allow proceeding
        isValid = true;
        this.canProceedSubject.next(true);
        break;

      case 'step3-4-2-pricing-tax':
        // Validate weekend pricing
        const taxData = formData['step3-4-2'];
        isValid = taxData?.premiumPercent >= 0 && taxData?.premiumPercent <= 100;
        break;

      default:
        isValid = true;
        break;
    }

    this.canProceedSubject.next(isValid);
    return isValid;
  }
}
