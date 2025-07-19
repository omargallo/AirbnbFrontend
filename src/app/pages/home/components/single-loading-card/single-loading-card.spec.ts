import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLoadingCard } from './single-loading-card';

describe('SingleLoadingCard', () => {
  let component: SingleLoadingCard;
  let fixture: ComponentFixture<SingleLoadingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleLoadingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleLoadingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
