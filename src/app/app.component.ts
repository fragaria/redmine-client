import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { Router } from '@angular/router';

import { environment } from '../environments/environment';
import { RedmineService } from './redmine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version: string;
  username: string;
  selectedPage = '';

  constructor(
    private router: Router,
    private redmine: RedmineService,
    private meta: Meta,
  ) {
    meta.addTag({name: 'version', content: environment.version});
    this.version = environment.version;
  }

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
