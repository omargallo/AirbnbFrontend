import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSettings } from './calendar-settings';

describe('CalendarSettings', () => {
  let component: CalendarSettings;
  let fixture: ComponentFixture<CalendarSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
