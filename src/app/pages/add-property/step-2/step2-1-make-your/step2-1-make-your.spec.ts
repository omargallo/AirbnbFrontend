import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step21MakeYour } from './step2-1-make-your';

describe('Step21MakeYour', () => {
  let component: Step21MakeYour;
  let fixture: ComponentFixture<Step21MakeYour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step21MakeYour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step21MakeYour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
