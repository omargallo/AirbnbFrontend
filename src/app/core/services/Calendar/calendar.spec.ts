import { TestBed } from '@angular/core/testing';

import { Calendar } from './calendar.service';

describe('Calendar', () => {
  let service: Calendar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Calendar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
