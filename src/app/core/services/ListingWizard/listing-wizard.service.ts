import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingWizardService {
  private nextStepSubject = new Subject<void>();
  nextStep$ = this.nextStepSubject.asObservable();

  triggerNextStep() {
    this.nextStepSubject.next();
  }
}
