import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListProperties } from './wishlist-properties';

describe('WishListProperties', () => {
  let component: WishListProperties;
  let fixture: ComponentFixture<WishListProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListProperties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishListProperties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
