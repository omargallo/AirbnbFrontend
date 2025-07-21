import { ComponentFixture, TestBed } from '@angular/core/testing';
import {PropertySwiperComponent} from "./mainswiper";

describe('PropertySwiperComponent', () => {
  let component: PropertySwiperComponent;
  let fixture: ComponentFixture<PropertySwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySwiperComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
