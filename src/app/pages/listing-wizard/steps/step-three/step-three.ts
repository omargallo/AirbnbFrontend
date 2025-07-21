import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  @Input() form!: FormGroup;

  suggestedPrice = 75; // This would come from your pricing service
  showPricingDetails = false;
  
  pricingBreakdown = {
    basePrice: 0,
    cleaningFee: 25,
    serviceFee: 0,
    taxes: 0
  };

  guestPreferences = [
    {
      id: 'experienced',
      title: 'An experienced guest',
      description: 'After your first guest, anyone can book',
      selected: true
    },
    {
      id: 'anyone',
      title: 'Anyone',
      description: 'Your place is ready for all guests',
      selected: false
    }
  ];

  constructor() {}

  updatePrice(event: any): void {
    const price = parseFloat(event.target.value) || 0;
    this.form.patchValue({ price: price });
    this.calculatePricingBreakdown(price);
  }

  calculatePricingBreakdown(basePrice: number): void {
    this.pricingBreakdown.basePrice = basePrice;
    this.pricingBreakdown.serviceFee = Math.round(basePrice * 0.03); // 3% service fee
    this.pricingBreakdown.taxes = Math.round((basePrice + this.pricingBreakdown.serviceFee) * 0.12); // 12% taxes
  }

  getTotalPrice(): number {
    return this.pricingBreakdown.basePrice + 
           this.pricingBreakdown.cleaningFee + 
           this.pricingBreakdown.serviceFee + 
           this.pricingBreakdown.taxes;
  }

  toggleInstantBook(): void {
    const currentValue = this.form.get('instantBook')?.value;
    this.form.patchValue({ instantBook: !currentValue });
  }

  selectGuestPreference(preferenceId: string): void {
    this.guestPreferences.forEach(pref => {
      pref.selected = pref.id === preferenceId;
    });
  }

  useSuggestedPrice(): void {
    this.form.patchValue({ price: this.suggestedPrice });
    this.calculatePricingBreakdown(this.suggestedPrice);
  }

  getFormSummary(): any {
    const formValue = this.form.value;
    return {
      propertyType: formValue.propertyType || 'Not specified',
      location: formValue.location || 'Not specified',
      capacity: `${formValue.guests} guests • ${formValue.bedrooms} bedrooms • ${formValue.bathrooms} bathrooms`,
      amenities: formValue.amenities?.length || 0,
      price: formValue.price || 0
    };
  }
}