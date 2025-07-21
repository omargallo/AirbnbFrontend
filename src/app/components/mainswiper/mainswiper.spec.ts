import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mainswiper } from './mainswiper';

describe('Mainswiper', () => {
  let component: Mainswiper;
  let fixture: ComponentFixture<Mainswiper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mainswiper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mainswiper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
