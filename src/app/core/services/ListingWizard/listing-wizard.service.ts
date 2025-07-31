import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingWizardService {
  private nextStepSubject = new Subject<void>();
  nextStep$ = this.nextStepSubject.asObservable();

  private stepValidationState = new BehaviorSubject<{ [key: string]: boolean }>({});
  stepValidation$ = this.stepValidationState.asObservable();

  triggerNextStep() {
    this.nextStepSubject.next();
  }

  updateStepValidation(stepId: string, isValid: boolean) {
    const currentState = this.stepValidationState.value;
    this.stepValidationState.next({
      ...currentState,
      [stepId]: isValid
    });
  }

  getStepValidation(stepId: string): boolean {
    return this.stepValidationState.value[stepId] || false;
  }
}
