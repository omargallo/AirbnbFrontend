import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step32PickBooking } from './step3-2-pick-booking';

describe('Step32PickBooking', () => {
  let component: Step32PickBooking;
  let fixture: ComponentFixture<Step32PickBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step32PickBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step32PickBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
