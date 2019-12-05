import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { TimeEntriesComponent } from './time-entries/time-entries.component';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { IssueComponent } from './issue/issue.component';
import { WeekLogComponent } from './week-log/week-log.component';
import { SettingsComponent } from './settings/settings.component';
import { GapsComponent } from './gaps/gaps.component';
import { GapComponent } from './gap/gap.component';
import { DailyTimeEntryComponent } from './daily-time-entry/daily-time-entry.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarItemComponent } from './calendar-item/calendar-item.component';
import { IssueLabelComponent } from './issue-label/issue-label.component';
import { CalendarWeekComponent } from './calendar-week/calendar-week.component';
import { ToastsContainerComponent } from './toasts/toast-container.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IssueListComponent,
    TimeEntriesComponent,
    TimeEntryComponent,
    IssueComponent,
    WeekLogComponent,
    ToastsContainerComponent,
    SettingsComponent,
    GapsComponent,
    GapComponent,
    DailyTimeEntryComponent,
    CalendarComponent,
    CalendarItemComponent,
    IssueLabelComponent,
    CalendarWeekComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbToastModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
