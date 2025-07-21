import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step3-5-add-discount',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step3-5-add-discount.html',
  styleUrl: './step3-5-add-discount.css'
})
export class Step35AddDiscount {
  discounts = [
    {
      key: 'new',
      title: 'New listing promotion',
      description: 'Offer 20% off your first 3 bookings',
      percent: 20,
      enabled: true,
      editable: false
    },
    {
      key: 'weekly',
      title: 'Weekly discount',
      description: 'For stays of 7 nights or more',
      percent: 10,
      enabled: false,
      editable: true
    },
    {
      key: 'monthly',
      title: 'Monthly discount',
      description: 'For stays of 28 nights or more',
      percent: 20,
      enabled: false,
      editable: true
    }
  ];

  toggleDiscount(idx: number) {
    this.discounts[idx].enabled = !this.discounts[idx].enabled;
  }

  onPercentInput(idx: number, event: Event) {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    let value = parseInt(input, 10) || 0;
    if (value > 99) value = 99;
    this.discounts[idx].percent = value;
  }
}
