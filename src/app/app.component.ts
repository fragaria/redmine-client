import { Component } from '@angular/core';

import { RedmineService } from './redmine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: string;

  constructor(
    private redmine: RedmineService
  ) { }

  setUsername(username: string) {
    this.username = username;
  }

  logout() {
    this.redmine.logout();
    delete this.username;
  }
}
