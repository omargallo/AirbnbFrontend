import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationModal } from './violation-modal';

describe('ViolationModal', () => {
  let component: ViolationModal;
  let fixture: ComponentFixture<ViolationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViolationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViolationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
