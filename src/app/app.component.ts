import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { RedmineService } from './redmine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: string;
  selectedPage = '';

  constructor(
    private router: Router,
    private redmine: RedmineService
  ) { }

  isSelected(url: string) {
    return url === this.router.url;
  }

  setUsername(username: string) {
    this.username = username;
  }

  logout() {
    this.redmine.logout();
    delete this.username;
  }
}
