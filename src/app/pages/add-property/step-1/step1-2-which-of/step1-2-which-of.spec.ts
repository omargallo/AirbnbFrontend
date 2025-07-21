import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step12WhichOf } from './step1-2-which-of';

describe('Step12WhichOf', () => {
  let component: Step12WhichOf;
  let fixture: ComponentFixture<Step12WhichOf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step12WhichOf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step12WhichOf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
