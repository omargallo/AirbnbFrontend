import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProperty1 } from './add-property';

describe('AddProperty1', () => {
  let component: AddProperty1;
  let fixture: ComponentFixture<AddProperty1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProperty1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProperty1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
