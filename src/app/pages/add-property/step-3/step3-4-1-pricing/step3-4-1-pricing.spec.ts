import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step341Pricing } from './step3-4-1-pricing';

describe('Step341Pricing', () => {
  let component: Step341Pricing;
  let fixture: ComponentFixture<Step341Pricing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step341Pricing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step341Pricing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
