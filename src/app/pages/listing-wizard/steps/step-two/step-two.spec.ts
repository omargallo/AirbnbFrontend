import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardStepTwoComponent } from './step-two';

describe('WizardStepTwoComponent', () => {
  let component: WizardStepTwoComponent;
  let fixture: ComponentFixture<WizardStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardStepTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});