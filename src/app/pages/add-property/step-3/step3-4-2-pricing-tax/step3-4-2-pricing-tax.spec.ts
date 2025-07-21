import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step342PricingTax } from './step3-4-2-pricing-tax';

describe('Step342PricingTax', () => {
  let component: Step342PricingTax;
  let fixture: ComponentFixture<Step342PricingTax>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step342PricingTax]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step342PricingTax);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
