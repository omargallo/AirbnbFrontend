import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyActivateModal } from './property-activate-modal';

describe('PropertyActivateModal', () => {
  let component: PropertyActivateModal;
  let fixture: ComponentFixture<PropertyActivateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyActivateModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyActivateModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
