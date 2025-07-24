import { Component } from '@angular/core';

@Component({
  selector: 'app-step1-tell-us',
  imports: [ ],
  templateUrl: './step1-1-tell-us.html',
  styleUrls: ['./step1-1-tell-us.css']
})
export class Step1TellUs {
  info: string = '';
  onInfoChange(newInfo: string): void {
    this.info = newInfo;
  }
}
