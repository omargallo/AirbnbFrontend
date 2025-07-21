import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingWizardComponent } from './listing-wizard';

describe('ListingWizardComponent', () => {
  let component: ListingWizardComponent;
  let fixture: ComponentFixture<ListingWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListingWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});