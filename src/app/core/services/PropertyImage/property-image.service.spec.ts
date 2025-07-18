import { TestBed } from '@angular/core/testing';

import { PropertyImageService } from './property-image.service';

describe('PropertyImageService', () => {
  let service: PropertyImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
