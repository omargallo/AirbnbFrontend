import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wizard-step-one', 
  templateUrl: './step-one.html', 
  styleUrls: ['./step-one.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule]
})
export class WizardStepOneComponent {
  @Input() form!: FormGroup;

  propertyTypes = [
    { id: 'house', name: 'House', description: 'A place that\'s usually 1-2 stories', icon: '🏠' },
    { id: 'apartment', name: 'Apartment', description: 'A place that\'s part of a building', icon: '🏢' },
    { id: 'villa', name: 'Villa', description: 'A luxurious standalone residence', icon: '🏖️' },
    { id: 'cabin', name: 'Cabin', description: 'A cozy wooden retreat', icon: '🏕️' },
    { id: 'condo', name: 'Condo', description: 'An owned unit in a building', icon: '🏙️' },
    { id: 'studio', name: 'Studio', description: 'A compact all-in-one space', icon: '🏠' }
  ];

  get locationControl(): FormControl {
    return this.form.get('location') as FormControl;
  }

  get guestsControl(): FormControl {
    return this.form.get('guests') as FormControl;
  }

  get bedroomsControl(): FormControl {
    return this.form.get('bedrooms') as FormControl;
  }

  get bathroomsControl(): FormControl {
    return this.form.get('bathrooms') as FormControl;
  }

  selectPropertyType(type: string): void {
    this.form.patchValue({ propertyType: type });
  }

  updateGuestCount(change: number): void {
    const current = this.guestsControl.value || 1;
    const newValue = Math.max(1, Math.min(16, current + change));
    this.guestsControl.setValue(newValue);
  }

  updateRoomCount(type: 'bedrooms' | 'bathrooms', change: number): void {
    const control = type === 'bedrooms' ? this.bedroomsControl : this.bathroomsControl;
    const current = control.value || 1;
    const newValue = Math.max(1, Math.min(10, current + change));
    control.setValue(newValue);
  }
}