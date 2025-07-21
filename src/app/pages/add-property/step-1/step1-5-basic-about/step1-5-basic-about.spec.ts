import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step15BasicAbout } from './step1-5-basic-about';

describe('Step15BasicAbout', () => {
  let component: Step15BasicAbout;
  let fixture: ComponentFixture<Step15BasicAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step15BasicAbout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step15BasicAbout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
