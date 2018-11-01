import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTimeEntryComponent } from './daily-time-entry.component';

describe('DailyTimeEntryComponent', () => {
  let component: DailyTimeEntryComponent;
  let fixture: ComponentFixture<DailyTimeEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyTimeEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTimeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
