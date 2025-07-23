import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secondary } from './secondary';

describe('Secondary', () => {
  let component: Secondary;
  let fixture: ComponentFixture<Secondary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secondary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secondary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
