import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step36Safety } from './step3-6-safety';

describe('Step36Safety', () => {
  let component: Step36Safety;
  let fixture: ComponentFixture<Step36Safety>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step36Safety]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step36Safety);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
