import { ComponentFixture, TestBed, flush, fakeAsync, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';

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
import { Injectable } from '@angular/core';

const MOCK_WEEK_LOGS = [weekLog1, weekLog1];

@Injectable()
class MockRedmineService extends RedmineService {
  listWeekLogs(): Observable<WeekLog[]> {
    return of(cloneDeep(MOCK_WEEK_LOGS));
  }
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(waitForAsync(() => {
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
    const calendarElement = fixture.debugElement;
    const iconElement = calendarElement.query(By.css(('.reload-button')));
    const listWeekLogsSpy = spyOn(component, 'listWorkingWeekLogs').and.callThrough();
    const redmineSpy = spyOn((component as any).redmine, 'listWeekLogs')
      .and.returnValue(of(cloneDeep([weekLog1])));
    const expectedWeekLogsAfterClick = [weekLog1];

    expect(component.weekLogs).toEqual(MOCK_WEEK_LOGS); // has data from MockRedmineService

    iconElement.triggerEventHandler('click', null); // reload data
    fixture.detectChanges();

    expect(listWeekLogsSpy).toHaveBeenCalled();
    expect(redmineSpy).toHaveBeenCalledWith(component.monthHtml5fmt);
    expect(component.weekLogs).toEqual(expectedWeekLogsAfterClick);
  });

  it('should fetch data after selecting a month', () => {
    const calendarElement = fixture.debugElement;
    const selectElement = calendarElement.query(By.css(('.custom-select')));
    const optionElements = calendarElement.queryAll(By.css(('.custom-select option')));

    expect(optionElements.length).toBeGreaterThan(0);
    expect(optionElements.length).toBe(component.months.length);

    const setMonthSpy = spyOn(component, 'setMonth').and.callThrough();
    const s = (component as any).redmine;
    const listWeekLogsSpy = spyOn(s, 'listWeekLogs').and.callThrough();

    selectElement.nativeElement.value = optionElements[1].nativeElement.value;
    selectElement.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(setMonthSpy).toHaveBeenCalledWith(optionElements[1].nativeElement.value);
    expect(component.monthHtml5fmt).toBe(optionElements[1].nativeElement.value);
    expect(listWeekLogsSpy).toHaveBeenCalledWith(optionElements[1].nativeElement.value);
  });

  it('should display calendar-weeks', () => {
    const calendarElement: HTMLElement = fixture.nativeElement;
    const elements = calendarElement.querySelectorAll('app-calendar-week');
    expect(elements.length).toEqual(component.weekLogs.length);
  });
});
