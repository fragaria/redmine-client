import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';

import { CalendarComponent } from './calendar.component';
import { CalendarWeekComponent } from '../calendar-week/calendar-week.component';
import { CalendarItemComponent } from '../calendar-item/calendar-item.component';
import { IssueLabelComponent } from '../issue-label/issue-label.component';
import { DailyTimeEntryComponent } from '../daily-time-entry/daily-time-entry.component';
import { GapComponent } from '../gap/gap.component';
import { TimeEntriesComponent } from '../time-entries/time-entries.component';

import { RedmineService } from '../redmine.service';
import { weekLog1 } from '../models/time-entries.mock';
import { WeekLog } from '../models/time-entries';

class MockRedmineService extends RedmineService {
  listWeekLogs(): Observable<WeekLog[]> {
    return of([weekLog1, weekLog1]);
  }
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarComponent,
        CalendarWeekComponent,
        CalendarItemComponent,
        IssueLabelComponent,
        GapComponent,
        DailyTimeEntryComponent,
        TimeEntriesComponent
      ],
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        ModalModule.forRoot()
      ],
      providers: [{ provide: RedmineService, useClass: MockRedmineService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data after click on the reload icon', () => {
    spyOn(component, 'listWorkingWeekLogs');

    const calendarElement = fixture.debugElement;
    const iconElement = calendarElement.query(By.css(('.reload')));
    iconElement.triggerEventHandler('click', null);

    fixture.whenStable().then(() => {
      expect(component.listWorkingWeekLogs).toHaveBeenCalled();
    });
  });

  it('should fetch data after selecting a month', () => {
    spyOn(component, 'listWorkingWeekLogs');

    const calendarElement = fixture.debugElement;
    const optionElements = calendarElement.queryAll(By.css(('.custom-select option')));

    expect(optionElements.length).toBeGreaterThan(0);
    expect(optionElements.length).toBe(component.months.length);

    optionElements[0].triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(component.monthHtml5fmt).toBe(optionElements[0].nativeElement.value);
      expect(component.listWorkingWeekLogs).toHaveBeenCalled();
    });
  });

  it('should display calendar-weeks', () => {
    const calendarElement: HTMLElement = fixture.nativeElement;
    const elements = calendarElement.querySelectorAll('app-calendar-week');
    expect(elements.length).toEqual(component.weekLogs.length);
  });
});
