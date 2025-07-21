import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1TellUs } from './step1-1-tell-us';

describe('Step1TellUs', () => {
  let component: Step1TellUs;
  let fixture: ComponentFixture<Step1TellUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1TellUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1TellUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
