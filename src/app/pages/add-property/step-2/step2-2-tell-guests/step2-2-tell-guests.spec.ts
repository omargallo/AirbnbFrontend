import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step22TellGuests } from './step2-2-tell-guests';

describe('Step22TellGuests', () => {
  let component: Step22TellGuests;
  let fixture: ComponentFixture<Step22TellGuests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step22TellGuests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step22TellGuests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
