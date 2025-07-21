import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListModal } from './wish-list-modal';

describe('WishListModal', () => {
  let component: WishListModal;
  let fixture: ComponentFixture<WishListModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishListModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
