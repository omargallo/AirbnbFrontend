import { TestBed } from '@angular/core/testing';

import { CalendarAvailabilityService } from './calendar-availability.service';

describe('CalendarAvailabilityService', () => {
  let service: CalendarAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
