import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';

@Component({
  selector: 'app-step3-4-2-pricing-tax',
  imports: [CommonModule],
  templateUrl: './step3-4-2-pricing-tax.html',
  styleUrl: './step3-4-2-pricing-tax.css'
})
export class Step342PricingTax implements OnInit, OnDestroy {
  private subscription!: Subscription;
  basePrice: number = 35; // This should come from previous step
  premiumPercent: number = 10;
  maxPremium: number = 99;
  guestFeePercent: number = 0.14;
  hostFeePercent: number = 0.1;
  view: 'guest' | 'host' = 'guest';
  isBreakdownVisible: boolean = false;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private validationService: ListingValidationService
  ) {}

  ngOnInit() {
    // Load pricing from previous step
    const prevStepData = this.formStorage.getStepData('step3-4-1');
    if (prevStepData?.price) {
      this.basePrice = prevStepData.price;
    }

    // Load saved data for this step
    const savedData = this.formStorage.getStepData('step3-4-2');
    if (savedData?.premiumPercent !== undefined) {
      this.premiumPercent = savedData.premiumPercent;
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });

    // Initial validation and save
    this.saveFormData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private saveFormData(): void {
    const data = {
      premiumPercent: this.premiumPercent,
      weekendPrice: this.weekendPrice
    };
    this.formStorage.saveFormData('step3-4-2', data);
    // Always enable next button
    this.validationService.validateStep('step3-4-2');
  }

  get weekendPrice(): number {
    return Math.round(this.basePrice * (1 + this.premiumPercent / 100));
  }

  get guestServiceFee(): number {
    return Math.round(this.weekendPrice * this.guestFeePercent);
  }

  get guestTotal(): number {
    return this.weekendPrice + this.guestServiceFee;
  }

  get hostServiceFee(): number {
    return Math.round(this.weekendPrice * this.hostFeePercent);
  }

  get hostTotal(): number {
    return this.weekendPrice - this.hostServiceFee;
  }

  onPremiumInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    let value = parseInt(input, 10) || 0;
    if (value > this.maxPremium) value = this.maxPremium;
    this.premiumPercent = value;
    this.saveFormData();
  }

  onPremiumSlider(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10) || 0;
    this.premiumPercent = value;
    this.saveFormData();
  }

  toggleView(): void {
    if (!this.isBreakdownVisible) {
      // When opening the table
      this.isBreakdownVisible = true;
      this.view = 'host'; // Switch to host view when opening
    } else {
      // When closing the table, just hide it
      this.isBreakdownVisible = false;
      this.view = 'guest'; // Reset to guest view when closing
    }
  }
}
