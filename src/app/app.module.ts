import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { TimeEntriesComponent } from './time-entries/time-entries.component';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { IssueComponent } from './issue/issue.component';
import { WeekLogComponent } from './week-log/week-log.component';
import { MessagesComponent } from './messages/messages.component';
import { SettingsComponent } from './settings/settings.component';
import { GapsComponent } from './gaps/gaps.component';
import { GapComponent } from './gap/gap.component';
import { DailyTimeEntryComponent } from './daily-time-entry/daily-time-entry.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarItemComponent } from './calendar-item/calendar-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IssueListComponent,
    TimeEntriesComponent,
    TimeEntryComponent,
    IssueComponent,
    WeekLogComponent,
    MessagesComponent,
    SettingsComponent,
    GapsComponent,
    GapComponent,
    DailyTimeEntryComponent,
    CalendarComponent,
    CalendarItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
