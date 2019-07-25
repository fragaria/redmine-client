import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CalendarItemComponent } from '../calendar-item/calendar-item.component';
import { IssueLabelComponent } from '../issue-label/issue-label.component';
import { DailyTimeEntryComponent } from '../daily-time-entry/daily-time-entry.component';
import { GapComponent } from '../gap/gap.component';
import { TimeEntriesComponent } from '../time-entries/time-entries.component';
import { weekLog1 } from '../models/time-entries.mock';
import { CalendarWeekComponent } from './calendar-week.component';


describe('CalendarWeekComponent', () => {
  @Component({
    selector: `app-host-component`,
    template: `<app-calendar-week [weekLog]="weekLog"></app-calendar-week>`
  })
  class TestHostComponent {
    weekLog = weekLog1;
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
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
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display calendar-items', () => {
    const calendarWeekElement: HTMLElement = fixture.nativeElement;
    const elements = calendarWeekElement.querySelectorAll('app-calendar-item');
    expect(elements.length).toEqual(weekLog1.dayLogs.length);
  });

  it('should display containers for missing days', () => {
    const calendarWeekElement: HTMLElement = fixture.nativeElement;
    const elements = calendarWeekElement.querySelectorAll('.missing');
    expect(elements.length).toEqual(7 - weekLog1.dayLogs.length);
  });

  it('should display week number', () => {
    const calendarWeekElement: HTMLElement = fixture.nativeElement;
    const weekNumberElement = calendarWeekElement.querySelector('.card-text');
    expect(weekNumberElement.textContent).toContain(`${weekLog1.weekNumber}.`);
  });
});
