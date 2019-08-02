import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';

import { TimeEntryComponent } from './time-entry.component';
import { SettingsService } from '../settings.service';
import { RedmineService } from '../redmine.service';
import { TimeEntry } from '../models/time-entries';

class MockRedmineService extends RedmineService {
  createNewTimeEntry(t): Observable<TimeEntry> {
    return of(t);
  }
}

describe('TimeEntryComponent', () => {
  let component: TimeEntryComponent;
  let fixture: ComponentFixture<TimeEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeEntryComponent
      ],
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
      ],
      providers: [{ provide: RedmineService, useClass: MockRedmineService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const redmineService = TestBed.get(RedmineService);
    const devActivity = { id: 1, name: 'Development' };
    const consultingActivity = { id: 1, name: 'Development' };
    (redmineService as any).activitiesEnum = [devActivity, consultingActivity];
    (redmineService as any).defaultActivity = devActivity;
    (redmineService as any).activitiesMap = new Map();
    (redmineService as any).activitiesMap.set(1, devActivity);
    fixture = TestBed.createComponent(TimeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be partially filled', () => {
    expect(component.timeEntryForm.valid).toBeTruthy();
    const settingsService = TestBed.get(SettingsService);
    expect(component.timeEntryForm.controls['hours'].value).toBe(settingsService.settings.dailyWorkingHours);
    expect(component.timeEntryForm.controls['from'].value).toBe(moment().format('YYYY-MM-DD'));
    expect(component.timeEntryForm.controls['period'].value).toEqual([]);
    expect(component.timeEntryForm.controls['comment'].value).toBe('');
  });

  it('should have toggle period button', () => {
    expect(component.logPeriod).toBe(false);
    const timeEntryElement = fixture.debugElement;
    const buttonElement = timeEntryElement.query(By.css(('.input-group-text')));
    const toggleLogPeriodSpy = spyOn(component, 'toggleLogPeriod').and.callThrough();

    buttonElement.triggerEventHandler('click', null);
    expect(component.logPeriod).toBe(true);
    fixture.detectChanges();
    expect(component.timeEntryForm.valid).toBeFalsy();
    expect(toggleLogPeriodSpy).toHaveBeenCalled();
  });

  it('should post new entry', () => {
    const issueId = 2609;
    const commentText = 'Comment';
    component.issueId = issueId;
    component.timeEntryForm.controls['comment'].setValue(commentText);
    expect(component.timeEntryForm.valid).toBeTruthy();

    let newEntry;
    component.newEntryEmitter.subscribe(x => newEntry = x);
    component.createNewTimeEntry();
    expect(newEntry.hours).toBe(component.timeEntryForm.controls['hours'].value);
    expect(newEntry.issue_id).toBe(issueId);
    expect(newEntry.activity_id).toBe(component.timeEntryForm.controls['activityId'].value);
    expect(newEntry.comments).toBe(commentText);
    expect(newEntry.spent_on).toBe(component.timeEntryForm.controls['from'].value);
  });

  it('should post new entries when logging period', () => {
    const issueId = 2609;
    const commentText = 'Comment';
    const date1 = moment();
    date1.add(1, 'days');
    const date2 = moment();
    date2.add(5, 'days');
    component.issueId = issueId;
    component.toggleLogPeriod();
    component.timeEntryForm.controls['from'].setValue(moment().format('YYYY-MM-DD')); // set to date that is before the selected period
    component.timeEntryForm.controls['comment'].setValue(commentText);
    component.timeEntryForm.controls['period'].setValue([date1.format('YYYY-MM-DD'), date2.format('YYYY-MM-DD')]);

    expect(component.timeEntryForm.valid).toBeTruthy();
    const newEntryEmitterSpy = spyOn(component.newEntryEmitter, 'emit').and.callThrough();
    const redmineServiceSpy = spyOn((component as any).redmine, 'createNewTimeEntry').and.callThrough();

    component.newEntryEmitter.subscribe(newEntry => {
      expect(newEntry.hours).toBe(component.timeEntryForm.controls['hours'].value);
      expect(newEntry.issue_id).toBe(issueId);
      expect(newEntry.activity_id).toBe(component.timeEntryForm.controls['activityId'].value);
      expect(newEntry.comments).toBe(commentText);
      expect(newEntry.spent_on).toBe(date1.format('YYYY-MM-DD'));
      date1.add(1, 'days');
    });
    component.createNewTimeEntry();
    expect(newEntryEmitterSpy).toHaveBeenCalledTimes(5);
    expect(redmineServiceSpy).toHaveBeenCalledTimes(5);
  });

  it('should validate the form for single day logging correctly', () => {
    expect(component.timeEntryForm.valid).toBeTruthy();
    component.timeEntryForm.controls['from'].setValue('');
    expect(component.timeEntryForm.valid).toBeFalsy();
  });

  it('should validate the form for period logging correctly', () => {
    const date1 = moment();
    const date2 = moment();
    date2.add(5, 'days');
    component.toggleLogPeriod();
    expect(component.timeEntryForm.valid).toBeFalsy();
    component.timeEntryForm.controls['period'].setValue([date1.format('YYYY-MM-DD'), date2.format('YYYY-MM-DD')]);
    expect(component.timeEntryForm.valid).toBeTruthy();
  });

  it('should limit the length of comment', () => {
    const longCommentText = new Array(component.commentMaxLength + 2).join('a');
    component.timeEntryForm.controls['comment'].setValue(longCommentText);
    expect(component.timeEntryForm.valid).toBeFalsy();
  });

  it('should validate count of hours', () => {
    component.timeEntryForm.controls['hours'].setValue(8);
    expect(component.timeEntryForm.valid).toBeTruthy();
    component.timeEntryForm.controls['hours'].setValue(25);
    expect(component.timeEntryForm.valid).toBeFalsy();
    component.timeEntryForm.controls['hours'].setValue(0);
    expect(component.timeEntryForm.valid).toBeFalsy();
  });

});
