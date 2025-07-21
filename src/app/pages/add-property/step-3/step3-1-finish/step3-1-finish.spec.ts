import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step31Finish } from './step3-1-finish';

describe('Step31Finish', () => {
  let component: Step31Finish;
  let fixture: ComponentFixture<Step31Finish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step31Finish]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step31Finish);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
