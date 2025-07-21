import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardStepOneComponent } from './step-one';

describe('WizardStepOneComponent', () => {
  let component: WizardStepOneComponent;
  let fixture: ComponentFixture<WizardStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardStepOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});