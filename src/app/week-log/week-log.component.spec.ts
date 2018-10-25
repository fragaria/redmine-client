import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekLogComponent } from './week-log.component';

describe('WeekLogComponent', () => {
  let component: WeekLogComponent;
  let fixture: ComponentFixture<WeekLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
