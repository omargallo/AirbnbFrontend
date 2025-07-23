import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesBox } from './messages-box';

describe('MessagesBox', () => {
  let component: MessagesBox;
  let fixture: ComponentFixture<MessagesBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
