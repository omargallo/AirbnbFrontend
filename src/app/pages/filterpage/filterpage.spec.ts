import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filterpage } from './filterpage';

describe('Filterpage', () => {
  let component: Filterpage;
  let fixture: ComponentFixture<Filterpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filterpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Filterpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
