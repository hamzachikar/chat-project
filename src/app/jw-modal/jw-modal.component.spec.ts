import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwModalComponent } from './jw-modal.component';

describe('JwModalComponent', () => {
  let component: JwModalComponent;
  let fixture: ComponentFixture<JwModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
