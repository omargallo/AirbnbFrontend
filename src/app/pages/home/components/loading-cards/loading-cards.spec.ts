import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingCards } from './loading-cards';

describe('LoadingCards', () => {
  let component: LoadingCards;
  let fixture: ComponentFixture<LoadingCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
