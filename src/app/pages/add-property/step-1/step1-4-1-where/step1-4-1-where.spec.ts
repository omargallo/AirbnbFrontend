import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step14Where } from './step1-4-1-where';

describe('Step14Where', () => {
  let component: Step14Where;
  let fixture: ComponentFixture<Step14Where>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step14Where]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step14Where);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
