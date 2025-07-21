import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step25Describe } from './step2-5-describe';

describe('Step25Describe', () => {
  let component: Step25Describe;
  let fixture: ComponentFixture<Step25Describe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step25Describe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step25Describe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
