import { TestBed } from '@angular/core/testing';

import { CommonPropInfoService } from './common-prop-info-service';

describe('CommonPropInfoService', () => {
  let service: CommonPropInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonPropInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
