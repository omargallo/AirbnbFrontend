import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wizard-step-three', 
  templateUrl: './step-three.html', 
  styleUrls: ['./step-three.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class WizardStepThreeComponent {
  // Address field getters for template type safety
  get apartmentControl(): FormControl {
    const control = this.addressGroup.get('apartment');
    if (!control) throw new Error('apartment control not found');
    return control as FormControl;
  }
  get streetControl(): FormControl {
    const control = this.addressGroup.get('street');
    if (!control) throw new Error('street control not found');
    return control as FormControl;
  }
  get cityControl(): FormControl {
    const control = this.addressGroup.get('city');
    if (!control) throw new Error('city control not found');
    return control as FormControl;
  }
  get governorateControl(): FormControl {
    const control = this.addressGroup.get('governorate');
    if (!control) throw new Error('governorate control not found');
    return control as FormControl;
  }
  get postalCodeControl(): FormControl {
    const control = this.addressGroup.get('postalCode');
    if (!control) throw new Error('postalCode control not found');
    return control as FormControl;
  }
  @Input() form!: FormGroup;
  @Input() currentSubStep!: number;

  suggestedPrice = 55;
  showPricingDetails = false;
  
  guestPreferences = [
    {
      id: 'experienced',
      title: 'An experienced guest',
      description: 'For your first guest, welcome someone with a good track record on Airbnb',
      selected: true
    },
    {
      id: 'anyone',
      title: 'Any Airbnb guest',
      description: 'Get reservations faster when you welcome anyone from the Airbnb community',
      selected: false
    }
  ];

  bookingOptions = [
    {
      id: 'approve',
      title: 'Approve your first 5 bookings',
      description: 'Start by reviewing reservation requests, then switch to Instant Book',
      recommended: true,
      selected: true
    },
    {
      id: 'instant',
      title: 'Use Instant Book',
      description: 'Let guests book automatically',
      recommended: false,
      selected: false
    }
  ];

  safetyItems = [
    { id: 'securityCamera', name: 'Exterior security camera present' },
    { id: 'noiseMonitor', name: 'Noise decibel monitor present' },
    { id: 'weaponsOnProperty', name: 'Weapon(s) on the property' }
  ];

  // Getter methods for form controls with proper typing and null checks
  get weekdayPriceControl(): FormControl {
    const control = this.form.get('weekdayPrice');
    if (!control) throw new Error('weekdayPrice control not found');
    return control as FormControl;
  }

  get weekendPriceControl(): FormControl {
    const control = this.form.get('weekendPrice');
    if (!control) throw new Error('weekendPrice control not found');
    return control as FormControl;
  }

  get weekendPremiumControl(): FormControl {
    const control = this.form.get('weekendPremium');
    if (!control) throw new Error('weekendPremium control not found');
    return control as FormControl;
  }

  get instantBookControl(): FormControl {
    const control = this.form.get('instantBook');
    if (!control) throw new Error('instantBook control not found');
    return control as FormControl;
  }

  get guestPreferenceControl(): FormControl {
    const control = this.form.get('guestPreference');
    if (!control) throw new Error('guestPreference control not found');
    return control as FormControl;
  }

  get addressGroup(): FormGroup {
    const group = this.form.get('address');
    if (!group) throw new Error('address group not found');
    return group as FormGroup;
  }

  constructor() {}

  updatePrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    const price = parseFloat(input.value) || 0;
    this.weekdayPriceControl.setValue(price);
  }

  updateWeekendPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    const price = parseFloat(input.value) || 0;
    this.weekendPriceControl.setValue(price);
  }

  updateWeekendPremium(event: Event): void {
    const input = event.target as HTMLInputElement;
    const premium = parseFloat(input.value) || 0;
    this.weekendPremiumControl.setValue(premium);
  }

  toggleInstantBook(optionId: string): void {
    this.bookingOptions.forEach(option => {
      option.selected = option.id === optionId;
    });
    this.instantBookControl.setValue(optionId === 'instant');
  }

  selectGuestPreference(preferenceId: string): void {
    this.guestPreferences.forEach(pref => {
      pref.selected = pref.id === preferenceId;
    });
    this.guestPreferenceControl.setValue(preferenceId);
  }

  toggleSafetyItem(itemId: string): void {
    const control = this.form.get(itemId) as FormControl;
    if (control) {
      control.setValue(!control.value);
    }
  }

  useSuggestedPrice(): void {
    this.weekdayPriceControl.setValue(this.suggestedPrice);
  }

  getTotalPrice(): number {
    const basePrice = this.weekdayPriceControl.value || 0;
    const weekendPremium = this.weekendPremiumControl.value || 0;
    return basePrice + (basePrice * (weekendPremium / 100));
  }

  getFormSummary(): any {
    const formValue = this.form.value;
    return {
      propertyType: formValue.propertyType || 'Not specified',
      location: formValue.location || 'Not specified',
      capacity: `${formValue.guests} guests • ${formValue.bedrooms} bedrooms • ${formValue.bathrooms} bathrooms`,
      amenities: formValue.amenities?.length || 0,
      price: formValue.weekdayPrice || 0
    };
  }
}