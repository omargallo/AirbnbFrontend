import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyFormStorageService } from '../../../../core/services/ListingWizard/property-form-storage.service';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step2-5-describe',
  imports: [CommonModule],
  templateUrl: './step2-5-describe.html',
  styleUrl: './step2-5-describe.css'
})
export class Step25Describe implements OnInit, OnDestroy {
  private subscription!: Subscription;
  highlights = [
    { key: 'peaceful', label: 'Peaceful', icon: 'peaceful' },
    { key: 'unique', label: 'Unique', icon: 'unique' },
    { key: 'family', label: 'Family-friendly', icon: 'family' },
    { key: 'stylish', label: 'Stylish', icon: 'stylish' },
    { key: 'central', label: 'Central', icon: 'central' },
    { key: 'spacious', label: 'Spacious', icon: 'spacious' }
  ];
  selected: string[] = [];
  maxSelections = 2;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService
  ) {}

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step2-5');
    if (savedData?.selected) {
      this.selected = savedData.selected;
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isSelected(key: string): boolean {
    return this.selected.includes(key);
  }

  selectHighlight(key: string): void {
    const idx = this.selected.indexOf(key);
    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else if (this.selected.length < this.maxSelections) {
      this.selected.push(key);
    }
    this.saveFormData();
  }

  private saveFormData(): void {
    const data = {
      selected: this.selected
    };
    this.formStorage.saveFormData('step2-5', data);
  }
}
