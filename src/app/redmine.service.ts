import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as moment from 'moment';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, take, filter } from 'rxjs/operators';

import { MessageService } from './message.service';
import { SettingsService } from './settings.service';

import { IssueList, Issue } from './models/issues';
import { UserResponse, User } from './models/users';
import { TimeEntryList, NewTimeEntry, TimeEntry, DayLog, WeekLog } from './models/time-entries';
import { TimeEntryActivityList, MessageType } from './models/enums';
import { Field } from './models/fields';

@Injectable({
  providedIn: 'root'
})
export class RedmineService {

  private currentUserPath = "/api/users/current.json";
  private myIssuesPath = "/api/issues.json?assigned_to_id=me";
  private issuesPathBase = "/api/issues";
  private timeEntriesPath = "/api/time_entries.json";
  private activitiesEnumPath = "/api/enumerations/time_entry_activities.json";

  private apiKeyHeader = "X-Redmine-API-Key";

  private currentUser: User = null;
  private activitiesEnum: Field[];
  private activitiesMap: Map<number, Field> = new Map();
  private defaultActivity: Field;
  private myIssues: IssueList = new IssueList();
  private myIssuesValidUntil = moment();
  private issuesMap: Map<number, Issue> = new Map();

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private settings: SettingsService
  ) {
    moment.updateLocale('en', {
      week : {
        dow : 1, // Monday is the first day of the week.
        doy : 3  // The week that contains Jan 4th is the first week of the year.
      }
    });
  }

  authenticate(username: string, password: string): Observable<User> {
    let httpOptions = this.httpOptions;
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Basic ' + btoa(`${username}:${password}`));
    return this.http
      .get<UserResponse>(this.currentUserPath, httpOptions).pipe(
        map((userResponse: UserResponse) => userResponse.user),
        tap(user => {
          this.currentUser = user;
          this.httpOptions.headers.append(this.apiKeyHeader, this.currentUser.api_key);
        }),
        catchError(this.handleError<User>("Authentication"))
      );
  }

  /**
   * https://www.redmine.org/projects/redmine/wiki/Rest_Issues
   */
  listMyIssues(noCache:boolean = false): Observable<IssueList> {
    if(noCache || this.myIssues.issues.length == 0) {
      // debugger;
      return this.http
        .get<IssueList>(this.myIssuesPath, this.httpOptions).pipe(
          tap((issueList: IssueList) => {
            console.log(`${issueList.total_count} issues found.`);
            // debugger;
            this.myIssues = issueList;
            for(let issue of issueList.issues) {
              this.issuesMap.set(issue.id, issue);
            }
          }),
          catchError(this.handleError<IssueList>("Listing your issues", new IssueList()))
        );
      } else {
        return of(this.myIssues);
      }
  }

  getIssueById(id: number): Observable<Issue> {
    if(this.issuesMap.has(id)) {
      return of(this.issuesMap.get(id));
    } else {
      const url = this.issuesPathBase + `/${id}.json`;
      return this.http.get<Issue>(url, this.httpOptions).pipe(
        map((response: {issue: Issue} ) => response.issue),
        tap(issue => this.issuesMap.set(issue.id, issue)),
        catchError(this.handleError<Issue>("Obtaining issue by ID"))
      )
    }
  }

  getLastTime(issueId: number): Observable<string> {
    const url = this.timeEntriesPath + `?issue_id=${issueId}&user_id=${this.currentUser.id}&limit=1`;
    // debugger;
    return this.http
      .get<TimeEntryList>(url, this.httpOptions).pipe(
        map((timeEntryList: TimeEntryList) => (timeEntryList.time_entries.length > 0) ? timeEntryList.time_entries[0].spent_on : ""),
        catchError(this.handleError<string>("Last log time computation", "", [404]))
      );
  }

  listTimeEntries(issueId: number): Observable<TimeEntryList> {
    const url = this.timeEntriesPath + `?issue_id=${issueId}&user_id=${this.currentUser.id}&limit=30`;
    // debugger;
    return this.http
      .get<TimeEntryList>(url, this.httpOptions).pipe(
        tap((issueList: IssueList) => console.log(`${issueList.total_count} time entries found.`)),
        catchError(this.handleError<TimeEntryList>("Listing time entries", new TimeEntryList()))
      );
  }

  /**
   * List logs for working days (Monday - Friday) in the given week or month. Returns descending list.
   * @param weekOrMonth - moment.HTML5_FMT.WEEK (YYYY-[W]WW) string, e.g. 2018-W06
   * or moment.HTML5_FMT.MONTH (YYYY-MM) string, e.g. 2018-04
   * @param momentUnit - 'week' or 'month' supported
   */
  listDayLogs(weekOrMonth: string, momentUnit: string, includeFuture: boolean = true, onlyWorkingDays: boolean = true, desc: boolean = true): Observable<DayLog[]> {
    let logMap = [];
    // debugger;

    const period = momentUnit as moment.unitOfTime.StartOf;
    const html5fmt = momentUnit == 'week' ? 'YYYY-[W]WW' : 'YYYY-MM';

    let dateToProcess = desc ? moment(weekOrMonth, html5fmt).endOf(period) : moment(weekOrMonth, html5fmt).startOf(period);
    const now = moment();
    while(dateToProcess.format(html5fmt) == weekOrMonth) {
      if((includeFuture || dateToProcess.isBefore(now, 'day') || dateToProcess.isSame(now, 'day')) // skip if future
          && (!onlyWorkingDays || dateToProcess.isoWeekday() < 6))  // skip non working day if needed
      {
        let dateToProcessString = dateToProcess.format("YYYY-MM-DD");
        logMap[dateToProcessString] = {
          date: dateToProcessString,
          dayOfWeek: dateToProcess.isoWeekday(),
          timeEntries: new TimeEntryList(),
          hoursLogged: 0
        };
      }
      if(desc) {
        dateToProcess.subtract(1, 'days');
      } else {
        dateToProcess.add(1, 'days');
      }
    }

    const min = moment(weekOrMonth, html5fmt).startOf(period).format("YYYY-MM-DD");
    const max = moment(weekOrMonth, html5fmt).endOf(period).format("YYYY-MM-DD");
    const url = this.timeEntriesPath + `?user_id=${this.currentUser.id}&spent_on=><${min}|${max}&limit=99`;

    return this.http
      .get<TimeEntryList>(url, this.httpOptions).pipe(
        tap((entryList: TimeEntryList) => console.log(`Process ${entryList.time_entries.length} of ${entryList.total_count} time entries found for the ${period}.`)),
        map((entryList: TimeEntryList) => {
          // debugger;
          for(let entry of entryList.time_entries) {
            if(logMap[entry.spent_on] !== undefined) {
              logMap[entry.spent_on].timeEntries.time_entries.push(entry);
              logMap[entry.spent_on].hoursLogged += entry.hours;
            }
          }
          // TODO repeat if needed
          return logMap;
        }),
        map((logMap: DayLog[]) => { // map from associative array to numberred
          let result = [];
          for(let key in logMap) {
            result.push(logMap[key]);
          }
          return result;
        }),
        // TODO filter(dayLog => dayLog.hoursLogged != this.settings.get().dailyWorkingHours),
        catchError(this.handleError<DayLog[]>('Listing daily logs', []))
      );
  }

  /**
   * @param month - moment.HTML5_FMT.MONTH (YYYY-MM) string, e.g. 2018-04
   */
  listWeekLogs(month: string): Observable<WeekLog[]> {
    let mmt = moment(month, moment.HTML5_FMT.MONTH).startOf('month');
    return this.listDayLogs(month, 'month', true, false, false).pipe(
      map((workingDayLogs : DayLog[]) => {
        let offset = 0;
        let weekLogs: WeekLog[] = [];
        do {
          const weekNumber = mmt.isoWeek();
          let weekLog = {
            weekNumber: weekNumber,
            startsWith: mmt.isoWeekday(),
            numberOfWorkingDays: 0,
            numberOfDays: 0,
            dayLogs: [],
            hoursLogged: 0
          };
          // debugger;
          do {
            const dayLog = workingDayLogs[offset];
            weekLog.dayLogs.push(dayLog);
            if(dayLog.dayOfWeek < 6) {
              weekLog.numberOfWorkingDays++;
            }
            weekLog.numberOfDays++;
            weekLog.hoursLogged += workingDayLogs[offset].hoursLogged;
            offset++;
          } while(offset < workingDayLogs.length && workingDayLogs[offset].dayOfWeek > 1);
          weekLogs.push(weekLog);
          mmt.add(1, 'weeks').startOf('week');
        } while (mmt.format(moment.HTML5_FMT.MONTH) == month);
        return weekLogs;
      }),
      catchError(this.handleError<WeekLog[]>("Listing week logs in the month", []))
    );
  }

  getActivitiesEnum(): Observable<Field[]> {
    // debugger;
    if(this.activitiesEnum === undefined || this.activitiesEnum == null || this.activitiesEnum.length == 0) {
      return this.http
        .get<TimeEntryActivityList>(this.activitiesEnumPath, this.httpOptions).pipe(
          map((activityList: TimeEntryActivityList) => activityList.time_entry_activities),
          tap(activities => {
            this.activitiesEnum = activities;
            this.activitiesMap = new Map();
            // debugger;
            for(let activity of activities) {
              this.activitiesMap.set(activity.id, activity);
            }
          }),
          catchError(this.handleError<Field[]>("Obtaining activities enum", []))
        );
    } else {
      // debugger;
      return of(this.activitiesEnum);
    }
  }

  getActivityById(id: number): Field {
    return this.activitiesMap.get(id);
  }

  getDefaultActivity(): Observable<Field> {
    let defaultActivityName = this.settings.get().defaultActivityName;
    // debugger;
    if(this.defaultActivity === undefined || this.defaultActivity == null || defaultActivityName != this.defaultActivity.name) {
      return this.getActivitiesEnum().pipe(
        map((activities: Field[]) => {
          // debugger;
          let result = null;

          for(let activity of activities) {
            if(activity.name == defaultActivityName) {
              return activity;
            }
          }
          return activities[0];
        }),
        tap(activity => this.defaultActivity = activity),
        catchError(this.handleError<Field>("Obtaining default activity"))
      );
    } else {
      return of(this.defaultActivity);
    }
  }

  createNewTimeEntry(timeEntry: NewTimeEntry): Observable<TimeEntry> {
    return this.http
      .post(this.timeEntriesPath, {"time_entry": timeEntry}, this.httpOptions).pipe(
        map((timeEntryContainer: {"time_entry": TimeEntry}) => timeEntryContainer.time_entry),
        catchError(this.handleError<TimeEntry>("New time entry creation"))
      );
  }

  logout() {
    delete this.currentUser;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * @param ignoreStatuses - list of statuses to be ignored
   */
  private handleError<T> (operation = 'Operation', result?: T, ignoreStatuses?: number[]) {
    return (error: any): Observable<T> => {
      if(ignoreStatuses === undefined || !ignoreStatuses.includes(error.status)) {
        this.messageService.add(`${operation} failed because of: ${this.extractErrorMessage(error)}`, MessageType.ERROR);
        console.log(`${operation} failed because of:\n${JSON.stringify(error)}`);
      }
      // TODO: better job of transforming error for user consumption
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private extractErrorMessage(error: any): string {
    if(error !== undefined && error != null && error.hasOwnProperty("message")) {
      return error.message;
    } else if(error.hasOwnProperty("error")) {
      return error.error;
    } else {
      return JSON.stringify(error);
    }
  }
}
