import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step142ConfirmAddress } from './step1-4-2-confirm-address';

describe('Step142ConfirmAddress', () => {
  let component: Step142ConfirmAddress;
  let fixture: ComponentFixture<Step142ConfirmAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step142ConfirmAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step142ConfirmAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
