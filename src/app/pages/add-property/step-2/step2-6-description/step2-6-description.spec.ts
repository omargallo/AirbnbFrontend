import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step26Description } from './step2-6-description';

describe('Step26Description', () => {
  let component: Step26Description;
  let fixture: ComponentFixture<Step26Description>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step26Description]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step26Description);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
