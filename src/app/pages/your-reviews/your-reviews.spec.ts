import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourReviews } from './your-reviews';

describe('YourReviews', () => {
  let component: YourReviews;
  let fixture: ComponentFixture<YourReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
