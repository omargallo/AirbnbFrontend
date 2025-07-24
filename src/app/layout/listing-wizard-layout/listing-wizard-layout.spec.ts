import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingWizardLayoutComponent } from './listing-wizard-layout';

describe('ListingWizardLayoutComponent', () => {
  let component: ListingWizardLayoutComponent;
  let fixture: ComponentFixture<ListingWizardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingWizardLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingWizardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});