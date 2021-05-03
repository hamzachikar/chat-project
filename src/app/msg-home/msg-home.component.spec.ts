import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgHomeComponent } from './msg-home.component';

describe('MsgHomeComponent', () => {
  let component: MsgHomeComponent;
  let fixture: ComponentFixture<MsgHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
