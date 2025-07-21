import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardStepThreeComponent } from './step-three';

describe('WizardStepThreeComponent', () => {
  let component: WizardStepThreeComponent;
  let fixture: ComponentFixture<WizardStepThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardStepThreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});