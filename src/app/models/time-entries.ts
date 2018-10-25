import { Field, CustomField } from './fields';

export class TimeEntryList {
  time_entries: TimeEntry[] = [];
  total_count: number = 0;
  offset: number = 0;
  limit: number = 0
};

export class TimeEntry {
  id: number;
  project: Field;
  issue: {
    id: number
  };
  user: Field;
  activity: Field;
  hours: number;
  comments: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
  // display extension
  isNew: boolean = false;
};

export class NewTimeEntry {
  issue_id: number;
  spent_on: string;
  hours: number;
  activity_id: number;
  activity_name: string;
  comments: string;
};
