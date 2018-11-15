import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLabelComponent } from './issue-label.component';

describe('IssueLabelComponent', () => {
  let component: IssueLabelComponent;
  let fixture: ComponentFixture<IssueLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
