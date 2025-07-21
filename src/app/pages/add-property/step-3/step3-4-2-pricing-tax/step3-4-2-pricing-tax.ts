import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step3-4-2-pricing-tax',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step3-4-2-pricing-tax.html',
  styleUrl: './step3-4-2-pricing-tax.css'
})
export class Step342PricingTax {
  basePrice: number = 35; // This should come from previous step
  premiumPercent: number = 10;
  maxPremium: number = 99;
  guestFeePercent: number = 0.14;
  hostFeePercent: number = 0.03;
  view: 'guest' | 'host' = 'guest';

  get weekendPrice(): number {
    return Math.round(this.basePrice * (1 + this.premiumPercent / 100));
  }
  get guestServiceFee(): number {
    return Math.round(this.weekendPrice * this.guestFeePercent);
  }
  get guestTotal(): number {
    return this.weekendPrice + this.guestServiceFee;
  }
  get hostServiceFee(): number {
    return Math.round(this.weekendPrice * this.hostFeePercent);
  }
  get hostTotal(): number {
    return this.weekendPrice - this.hostServiceFee;
  }

  onPremiumInput(event: Event) {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    let value = parseInt(input, 10) || 0;
    if (value > this.maxPremium) value = this.maxPremium;
    this.premiumPercent = value;
  }

  onPremiumSlider(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10) || 0;
    this.premiumPercent = value;
  }

  toggleView() {
    this.view = this.view === 'guest' ? 'host' : 'guest';
  }
}
