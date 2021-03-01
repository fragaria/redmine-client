import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TimeEntryList } from '../models/time-entries';

import { TimeEntriesComponent } from './time-entries.component';

describe('TimeEntriesComponent', () => {
  let component: TimeEntriesComponent;
  let fixture: ComponentFixture<TimeEntriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeEntriesComponent);
    component = fixture.componentInstance;
    component.entries = new TimeEntryList();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
