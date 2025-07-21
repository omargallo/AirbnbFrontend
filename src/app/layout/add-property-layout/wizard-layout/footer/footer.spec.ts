import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit back event', () => {
    spyOn(component.back, 'emit');
    component.currentStep = 2;
    fixture.detectChanges();
    component.onBackClick();
    expect(component.back.emit).toHaveBeenCalled();
  });

  it('should calculate segment fill correctly', () => {
    // Test cases for when totalSteps <= 3
    component.totalSteps = 3;
    component.currentStep = 1;
    expect(component.getSegmentFill(0)).toBe(0);
    component.currentStep = 2;
    expect(component.getSegmentFill(0)).toBe(100);

    // Test cases for when totalSteps > 3
    component.totalSteps = 10;
    component.currentStep = 4; // Second segment (steps 4-7)
    expect(component.getSegmentFill(1)).toBeGreaterThan(0);
    expect(component.getSegmentFill(1)).toBeLessThan(100);
    component.currentStep = 7;
    expect(component.getSegmentFill(1)).toBe(100);
  });

  it('should show correct buttons based on current step', () => {
    component.totalSteps = 3;
    
    component.currentStep = 1;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.back-button')).toBeNull();
    expect(fixture.nativeElement.querySelector('.next-button')).toBeTruthy();

    component.currentStep = 3;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.next-button')).toBeNull();
    expect(fixture.nativeElement.querySelector('.next-button:contains("Get Started")')).toBeTruthy();
  });
});