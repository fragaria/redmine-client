import { Field, CustomField } from './fields';
import { TimeEntryList } from './time-entries';

export class IssueList {
  issues: Issue[] = [];
  total_count: number = 0;
  offset: number = 0;
  limit: number = 0;
};

export class IssueDetail {
  issue: Issue;
}

export class Issue {
  id: number;
  project: Field;
  tracker: Field;
  status: Field;
  priority: Field;
  author: Field;
  assigned_to: Field;
  subject: string;
  description: string;
  start_date: string;
  done_ratio: number;
  custom_fields: CustomField[];
  created_on: string;
  updated_on: string;
};
