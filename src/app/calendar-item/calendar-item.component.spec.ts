import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import cloneDeep from 'lodash.clonedeep';

import { CalendarItemComponent } from './calendar-item.component';
import { IssueLabelComponent } from '../issue-label/issue-label.component';
import { DailyTimeEntryComponent } from '../daily-time-entry/daily-time-entry.component';
import { GapComponent } from '../gap/gap.component';
import { TimeEntriesComponent } from '../time-entries/time-entries.component';
import { dayLog2 } from '../models/time-entries.mock';

describe('CalendarItemComponent', () => {
  @Component({
    selector: `app-host-component`,
    template: `<app-calendar-item [dayLog]="dayLog"></app-calendar-item>`
  })
  class TestHostComponent {
    dayLog = cloneDeep(dayLog2);
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
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

  it('should display date', () => {
    const calendarItemElement: HTMLElement = fixture.nativeElement;
    const dateElement = calendarItemElement.querySelector('.card-title');
    expect(dateElement.textContent).toContain(`${dayLog2.date}`);
  });

  it('should display total', () => {
    const calendarItemElement: HTMLElement = fixture.nativeElement;
    const totalElement = calendarItemElement.querySelector('.card-footer');
    expect(totalElement.textContent).toContain(`Total: ${dayLog2.hoursLogged}`);
  });

  it('should display time entries with issue label', () => {
    const calendarItemElement: HTMLElement = fixture.nativeElement;
    const elements = calendarItemElement.querySelectorAll('.card-text span');
    expect(elements.length).toEqual(dayLog2.timeEntries.time_entries.length);
    elements.forEach((el, index) => {
      expect(el.textContent).toContain(`${dayLog2.timeEntries.time_entries[index].hours}h`);
      expect(el.querySelector('app-issue-label')).toBeTruthy();
    });
  });

  it('should display modal after click', () => {
    const calendarItemElement = fixture.debugElement;
    const itemBodyElement = calendarItemElement.query(By.css('.card-body'));
    itemBodyElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.modal-dialog'))).toBeTruthy();
  });
});
