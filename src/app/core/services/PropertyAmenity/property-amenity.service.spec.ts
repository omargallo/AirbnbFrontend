import { TestBed } from '@angular/core/testing';

import { PropertyAmenityService } from './property-amenity.service';

describe('PropertyAmenityService', () => {
  let service: PropertyAmenityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyAmenityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
