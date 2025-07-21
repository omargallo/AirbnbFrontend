import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step3-3-choose-welcome',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step3-3-choose-welcome.html',
  styleUrl: './step3-3-choose-welcome.css'
})
export class Step33ChooseWelcome {
  options = [
    {
      key: 'any',
      title: 'Any Airbnb guest',
      description: 'Get reservations faster when you welcome anyone from the Airbnb community.'
    },
    {
      key: 'experienced',
      title: 'An experienced guest',
      description: 'For your first guest, welcome someone with a good track record on Airbnb who can offer tips for how to be a great Host.'
    }
  ];
  selected: string = 'any';

  isSelected(key: string): boolean {
    return this.selected === key;
  }

  selectOption(key: string): void {
    this.selected = key;
  }
}
