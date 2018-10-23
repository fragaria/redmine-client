import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { TimeEntriesComponent } from './time-entries/time-entries.component';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { IssueComponent } from './issue/issue.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IssueListComponent,
    TimeEntriesComponent,
    TimeEntryComponent,
    IssueComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
