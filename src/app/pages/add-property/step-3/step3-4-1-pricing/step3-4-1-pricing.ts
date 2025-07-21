import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step3-4-1-pricing',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step3-4-1-pricing.html',
  styleUrl: './step3-4-1-pricing.css'
})
export class Step341Pricing {
  price: number = 35;
  maxLength: number = 4;
  guestFeePercent: number = 0.14;
  hostFeePercent: number = 0.03;
  view: 'guest' | 'host' = 'guest';

  get guestServiceFee(): number {
    return Math.round(this.price * this.guestFeePercent);
  }
  get guestTotal(): number {
    return this.price + this.guestServiceFee;
  }
  get hostServiceFee(): number {
    return Math.round(this.price * this.hostFeePercent);
  }
  get hostTotal(): number {
    return this.price - this.hostServiceFee;
  }

  onPriceInput(event: Event) {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    let value = parseInt(input, 10) || 0;
    if (value > 9999) value = 9999;
    this.price = value;
  }

  toggleView() {
    this.view = this.view === 'guest' ? 'host' : 'guest';
  }
}
