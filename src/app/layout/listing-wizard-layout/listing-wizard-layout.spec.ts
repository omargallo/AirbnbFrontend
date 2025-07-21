import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingWizardLayout } from './listing-wizard-layout';

describe('ListingWizardLayout', () => {
  let component: ListingWizardLayout;
  let fixture: ComponentFixture<ListingWizardLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingWizardLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingWizardLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
