import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step3-2-pick-booking',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step3-2-pick-booking.html',
  styleUrl: './step3-2-pick-booking.css'
})
export class Step32PickBooking {
  options = [
    {
      key: 'approve',
      title: 'Approve your first 5 bookings',
      description: 'Start by reviewing reservation requests, then switch to Instant Book, so guests can book automatically.',
      recommended: true,
      icon: 'approve'
    },
    {
      key: 'instant',
      title: 'Use Instant Book',
      description: 'Let guests book automatically.',
      recommended: false,
      icon: 'instant'
    }
  ];
  selected: string = 'approve';

  isSelected(key: string): boolean {
    return this.selected === key;
  }

  selectOption(key: string): void {
    this.selected = key;
  }
}
