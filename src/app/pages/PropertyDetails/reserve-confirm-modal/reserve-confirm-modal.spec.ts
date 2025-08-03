import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveConfirmModal } from './reserve-confirm-modal';

describe('ReserveConfirmModal', () => {
  let component: ReserveConfirmModal;
  let fixture: ComponentFixture<ReserveConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveConfirmModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserveConfirmModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
