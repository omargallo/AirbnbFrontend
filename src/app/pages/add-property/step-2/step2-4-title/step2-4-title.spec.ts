import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step24Title } from './step2-4-title';

describe('Step24Title', () => {
  let component: Step24Title;
  let fixture: ComponentFixture<Step24Title>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step24Title]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step24Title);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
