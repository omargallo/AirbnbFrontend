import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step1-4-where',
  imports: [FormsModule, FooterComponent],
  templateUrl: './step1-4-1-where.html',
  styleUrl: './step1-4-1-where.css'
})
export class Step14Where {
  // Address entered by the user
  address: string = '';

  // Method to handle address input changes
  onAddressChange(newAddress: string): void {
    this.address = newAddress;
  }
}
