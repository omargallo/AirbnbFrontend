import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockingOverlay } from './blocking-overlay';

describe('BlockingOverlay', () => {
  let component: BlockingOverlay;
  let fixture: ComponentFixture<BlockingOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockingOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockingOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
