import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step13WhatType } from './step1-3-what-type';

describe('Step13WhatType', () => {
  let component: Step13WhatType;
  let fixture: ComponentFixture<Step13WhatType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step13WhatType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step13WhatType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
