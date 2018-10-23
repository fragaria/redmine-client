import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationStart, RouterEvent } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { IssueListComponent } from './issue-list/issue-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'issues', component: IssueListComponent},
  { path: 'home', redirectTo: '/issues'},
  { path: '', redirectTo: '/issues', pathMatch: 'full'}
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
