import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step23AddPhotos } from './step2-3-1-add-photos';

describe('Step23AddPhotos', () => {
  let component: Step23AddPhotos;
  let fixture: ComponentFixture<Step23AddPhotos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step23AddPhotos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step23AddPhotos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
