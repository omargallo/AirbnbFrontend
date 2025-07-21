import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step33ChooseWelcome } from './step3-3-choose-welcome';

describe('Step33ChooseWelcome', () => {
  let component: Step33ChooseWelcome;
  let fixture: ComponentFixture<Step33ChooseWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step33ChooseWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step33ChooseWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
