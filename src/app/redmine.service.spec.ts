import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import cloneDeep from 'lodash.clonedeep';

import { RedmineService } from './redmine.service';
import { WeekLog } from './models/time-entries';
import { MessageType } from './models/enums';

const MOCK_USER_RESPONSE = {
  user: {
    id: 11,
    login: 'john.doe@fragaria.cz',
    firstname: 'John',
    lastname: 'Doe',
    mail: 'john.doe@fragaria.cz',
    created_on: '2019-07-01T11:13:34Z',
    last_login_on: '2019-07-25T19:59:10Z',
    api_key: 'xxxxxxxxxxxxxxxx',
  }
};

const MOCK_LIST_ENTRY_RESPONSE = {
  time_entries: [],
  total_count: 0,
  offset: 0,
  limit: 0
};

describe('RedmineService', () => {
  let httpTestingController: HttpTestingController;
  let service: RedmineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedmineService],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RedmineService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate', () => {
    const username = 'username';
    const password = 'password';
    service.authenticate(username, password)
      .subscribe(data => {
        expect(data).toEqual(MOCK_USER_RESPONSE.user);
        expect((service as any).currentUser).toEqual(MOCK_USER_RESPONSE.user);
      });

    const req = httpTestingController.expectOne('/api/users/current.json');
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa(`${username}:${password}`));
    req.flush(cloneDeep(MOCK_USER_RESPONSE));
  });

  it('should create error message when authentication fails', () => {
    const messageServiceSpy = spyOn((service as any).messageService, 'add');

    service.authenticate('username', 'incorrectPassword')
      .subscribe(() => {
        expect(messageServiceSpy).toHaveBeenCalledWith(jasmine.stringMatching('Authentication failed'),  MessageType.ERROR);
      });

    const req = httpTestingController.expectOne('/api/users/current.json');
    expect(req.request.method).toEqual('GET');
    req.flush(null, { status: 401, statusText: 'Unauthorized'});
  });

  it('should listWeekLogs including days from previous and next month', () => {
    (service as any).currentUser = MOCK_USER_RESPONSE.user;
    service.listWeekLogs('2019-08').subscribe((data: WeekLog[]) => {
      expect(data.length).toBe(5);
      data.forEach((week) => {
        expect(week.hoursLogged).toBe(0);
        expect(week.dayLogs.length).toBe(7);
      });
    });

    const req = httpTestingController.expectOne('/api/time_entries.json?user_id=11&spent_on=><2019-07-29|2019-09-01&limit=99');
    expect(req.request.method).toEqual('GET');
    req.flush(cloneDeep(MOCK_LIST_ENTRY_RESPONSE));
  });

});
