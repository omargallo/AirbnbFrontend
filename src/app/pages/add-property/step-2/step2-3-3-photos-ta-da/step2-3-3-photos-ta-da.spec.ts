import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step233PhotosTaDa } from './step2-3-3-photos-ta-da';

describe('Step233PhotosTaDa', () => {
  let component: Step233PhotosTaDa;
  let fixture: ComponentFixture<Step233PhotosTaDa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step233PhotosTaDa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step233PhotosTaDa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
