import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { WeekLogComponent } from './week-log.component';
import { GapComponent } from '../gap/gap.component';
import { DailyTimeEntryComponent } from '../daily-time-entry/daily-time-entry.component';
import { TimeEntriesComponent } from '../time-entries/time-entries.component';
import { IssueLabelComponent } from '../issue-label/issue-label.component';

import { RedmineService } from '../redmine.service'
import { DayLog, TimeEntryList } from '../models/time-entries';

class MockRedmineService extends RedmineService {
  listDayLogs(): Observable<DayLog[]> {
    const data: DayLog[] = [{
      date: "2019-07-22", dayOfWeek: 1, timeEntries: {
        total_count: 0,
        offset: 0,
        limit: 0,
        time_entries: [{
          activity: { id: 9, name: "Development" },
          comments: "a",
          created_on: "2019-07-17T08:48:35Z",
          hours: 8,
          id: 29329,
          isNew: true,
          issue: { id: 4411 },
          project: { id: 112, name: "Redmine test" },
          spent_on: "2019-07-22",
          updated_on: "2019-07-17T08:48:35Z",
          user: { id: 56, name: "John Doe" }
        }]
      }, hoursLogged: 8
    }, {
      date: "2019-07-22", dayOfWeek: 1, timeEntries: {
        total_count: 0,
        offset: 0,
        limit: 0,
        time_entries: []
      }, hoursLogged: 4.25
    }]
    return of(data);
  }
}

describe('WeekLogComponent', () => {
  let component: WeekLogComponent;
  let fixture: ComponentFixture<WeekLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeekLogComponent, GapComponent, DailyTimeEntryComponent, TimeEntriesComponent, IssueLabelComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [{ provide: RedmineService, useClass: MockRedmineService },]
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

  it('should calculate totalSum', () => {
    expect(component.totalSum).toBe(12.25);
  });

  it('should display totalSum', () => {
    const weekLogElement: HTMLElement = fixture.nativeElement;
    const totalSumElement = weekLogElement.querySelector('.total-sum');
    expect(totalSumElement.textContent).toEqual('12.25');
  });

  it('should generate nonemmpty weeks', () => {
    expect(component.weeks.length).toBe(8);
  });

  it('should generate weeks that are containining current week', () => {
    expect(component.weeks[0].html5fmt).toBe(component.weekHtml5fmt);
  });

  it('should display record for each day', () => {
    const weekLogElement: HTMLElement = fixture.nativeElement;
    const dayItemElements = weekLogElement.querySelectorAll('.week-records app-gap');
    expect(dayItemElements.length).toEqual(2);
  });
});
