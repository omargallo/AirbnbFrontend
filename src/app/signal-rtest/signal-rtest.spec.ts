import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalRTest } from './signal-rtest';

describe('SignalRTest', () => {
  let component: SignalRTest;
  let fixture: ComponentFixture<SignalRTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalRTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalRTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
