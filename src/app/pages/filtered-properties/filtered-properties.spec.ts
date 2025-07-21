import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredProperties } from './filtered-properties';

describe('FilteredProperties', () => {
  let component: FilteredProperties;
  let fixture: ComponentFixture<FilteredProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredProperties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredProperties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
