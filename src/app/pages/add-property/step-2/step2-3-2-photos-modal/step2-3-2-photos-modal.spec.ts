import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step232PhotosModal } from './step2-3-2-photos-modal';

describe('Step232PhotosModal', () => {
  let component: Step232PhotosModal;
  let fixture: ComponentFixture<Step232PhotosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step232PhotosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step232PhotosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
