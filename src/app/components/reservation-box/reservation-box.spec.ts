import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationBox } from './reservation-box';

describe('ReservationBox', () => {
  let component: ReservationBox;
  let fixture: ComponentFixture<ReservationBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
