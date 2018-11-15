import { Component, OnInit, Input } from '@angular/core';

import { RedmineService } from '../redmine.service';

import { Issue } from '../models/issues';

@Component({
  selector: 'app-issue-label',
  templateUrl: './issue-label.component.html',
  styleUrls: ['./issue-label.component.css']
})
export class IssueLabelComponent implements OnInit {

  @Input() issueId: number;

  label: string = "";

  constructor(
    private redmine: RedmineService
  ) { }

  ngOnInit() {
    this.redmine.getIssueById(this.issueId).subscribe(
      issue => {
        this.label = (issue !== undefined) ? issue.subject : "Issue #" + this.issueId
      }
    );
  }

}
