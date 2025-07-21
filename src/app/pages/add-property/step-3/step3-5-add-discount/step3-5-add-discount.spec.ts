import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step35AddDiscount } from './step3-5-add-discount';

describe('Step35AddDiscount', () => {
  let component: Step35AddDiscount;
  let fixture: ComponentFixture<Step35AddDiscount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step35AddDiscount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step35AddDiscount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
