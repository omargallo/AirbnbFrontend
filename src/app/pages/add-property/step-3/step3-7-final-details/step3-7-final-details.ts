import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step3-7-final-details',
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './step3-7-final-details.html',
  styleUrl: './step3-7-final-details.css'
})
export class Step37FinalDetails {
  address = {
    country: 'EG',
    street: '',
    apt: '',
    city: '',
    state: '',
    zipcode: ''
  };
  hostingType: 'yes' | 'no' | null = null;

  setHostingType(type: 'yes' | 'no') {
    this.hostingType = type;
  }
}
