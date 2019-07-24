import { Component, OnInit } from '@angular/core';

import { RedmineService } from '../redmine.service';
import { IssueList, Issue } from '../models/issues';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {

  issues: Issue[];
  total_count = 0;
  offset = 0;
  limit = 0;

  constructor(
    private redmine: RedmineService
  ) { }

  ngOnInit() {
    this.getIssues();
  }

  getIssues() {
    this.redmine.listMyIssues(true).subscribe(issueList => {
      this.issues = issueList.issues;
      this.total_count = issueList.total_count;
      this.offset = issueList.offset;
      this.limit = issueList.limit;
    });
  }

}
