import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationStart, RouterEvent } from '@angular/router';

import * as moment from 'moment';

import { LoginComponent } from './login/login.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { WeekLogComponent } from './week-log/week-log.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'issues', component: IssueListComponent},
  { path: 'week', component: WeekLogComponent/*, data: {weekDate: moment()}*/},
  { path: 'home', redirectTo: '/week'},
  { path: '', redirectTo: '/week', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

  constructor(
    private router:Router
  ) {
  }

}
