import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step3-6-safety',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step3-6-safety.html',
  styleUrl: './step3-6-safety.css'
})
export class Step36Safety {
  safetyItems = [
    {
      key: 'camera',
      label: 'Exterior security camera present',
      checked: false
    },
    {
      key: 'noise',
      label: 'Noise decibel monitor present',
      checked: false
    },
    {
      key: 'weapon',
      label: 'Weapon(s) on the property',
      checked: false
    }
  ];

  toggleItem(idx: number) {
    this.safetyItems[idx].checked = !this.safetyItems[idx].checked;
  }
}
