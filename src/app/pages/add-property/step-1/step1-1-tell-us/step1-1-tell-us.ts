import { Component } from '@angular/core';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step1-tell-us',
  imports: [ FooterComponent],
  templateUrl: './step1-1-tell-us.html',
  styleUrls: ['./step1-1-tell-us.css']
})
export class Step1TellUs {
  info: string = '';
  onInfoChange(newInfo: string): void {
    this.info = newInfo;
  }
}
