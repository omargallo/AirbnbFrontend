import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step37FinalDetails } from './step3-7-final-details';

describe('Step37FinalDetails', () => {
  let component: Step37FinalDetails;
  let fixture: ComponentFixture<Step37FinalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step37FinalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step37FinalDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
