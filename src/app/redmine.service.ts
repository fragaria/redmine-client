import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, take } from 'rxjs/operators';

import { IssueList } from './models/issues';
import { UserResponse, User } from './models/users';
import { TimeEntryList, NewTimeEntry, TimeEntry } from './models/time-entries';
import { TimeEntryActivityList } from './models/enums';
import { Field } from './models/fields';

@Injectable({
  providedIn: 'root'
})
export class RedmineService {

  public defaultHours = 8;

  private defaultActivityName = 'Development';

  private currentUserPath = "/api/users/current.json";
  private myIssuesPath = "/api/issues.json?assigned_to_id=me";
  private timeEntriesPath = "/api/time_entries.json";
  private activitiesEnumPath = "/api/enumerations/time_entry_activities.json";

  private apiKeyHeader = "X-Redmine-API-Key";

  private currentUser: User = null;
  private activitiesEnum: Field[];
  private activitiesMap: Map<number, Field>;
  private defaultActivity: Field;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  constructor(
    private http: HttpClient
  ) { }

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
        catchError(this.handleError<User>("authenticate"))
      );
  }

  /**
   * https://www.redmine.org/projects/redmine/wiki/Rest_Issues
   */
  listMyIssues(): Observable<IssueList> {
    // debugger;
    return this.http
      .get<IssueList>(this.myIssuesPath, this.httpOptions).pipe(
        tap((issueList: IssueList) => {
          console.log(`${issueList.total_count} issues found.`);
        }),
        catchError(this.handleError<IssueList>("listMyIssues"))
      );
  }

  getLastTime(issueId: number): Observable<string> {
    const url = this.timeEntriesPath + `?issue_id=${issueId}&user_id=${this.currentUser.id}&limit=1`;
    // debugger;
    return this.http
      .get<TimeEntryList>(url, this.httpOptions).pipe(
        map((timeEntryList: TimeEntryList) => (timeEntryList.time_entries.length > 0) ? timeEntryList.time_entries[0].spent_on : ""),
        catchError(this.handleError<string>("getLastTime", "", [404]))
      );
  }

  getTimeEntries(issueId: number): Observable<TimeEntryList> {
    const url = this.timeEntriesPath + `?issue_id=${issueId}&user_id=${this.currentUser.id}&limit=30`;
    // debugger;
    return this.http
      .get<TimeEntryList>(url, this.httpOptions).pipe(
        tap((issueList: IssueList) => console.log(`${issueList.total_count} time entries found.`)),
        catchError(this.handleError<string>("getTimeEntries"))
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
          catchError(this.handleError<Field[]>("getActivitiesEnum", []))
        );
    } else {
      // debugger;
      return of(this.activitiesEnum);
    }
  }

  getActivityById(id: number): Field {
    return (this.activitiesMap !== undefined && this.activitiesMap != null) ? this.activitiesMap.get(id) : null;
  }

  getDefaultActivity(): Observable<Field> {
    // debugger;
    if(this.defaultActivity === undefined || this.defaultActivity == null) {
      return this.getActivitiesEnum().pipe(
        map((activities: Field[]) => {
          let result = null;
          for(let activity of activities) {
            if(activity.name == this.defaultActivityName) {
              return activity;
            }
          }
          return activities[0];
        }),
        tap(activity => this.defaultActivity = activity),
        catchError(this.handleError<Field>("getDefaultActivity"))
      );
    } else {
      return of(this.defaultActivity);
    }
  }

  createNewTimeEntry(timeEntry: NewTimeEntry): Observable<TimeEntry> {
    return this.http
      .post(this.timeEntriesPath, {"time_entry": timeEntry}, this.httpOptions).pipe(
        map((timeEntryContainer: {"time_entry": TimeEntry}) => timeEntryContainer.time_entry),
        catchError(this.handleError<TimeEntry>("getTimeEntries"))
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
  private handleError<T> (operation = 'operation', result?: T, ignoreStatuses?: number[]) {
    return (error: any): Observable<T> => {
      if(ignoreStatuses === undefined || !ignoreStatuses.includes(error.status)) {
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
      }
      // TODO: better job of transforming error for user consumption
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
