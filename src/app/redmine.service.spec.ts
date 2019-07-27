import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { RedmineService } from './redmine.service';
import { WeekLog } from './models/time-entries';


const mockUserResponse = {
  user: {
    api_key: 'xxxxxxxxxxxxxxxx',
    created_on: '2019-07-01T11:13:34Z',
    firstname: 'John',
    id: 11,
    last_login_on: '2019-07-25T19:59:10Z',
    lastname: 'Doe',
    login: 'john.doe@fragaria.cz',
    mail: 'john.doe@fragaria.cz',

  }
};

const mockListEntryResponse = {
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

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(RedmineService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate', () => {
    service.authenticate('username', 'password')
      .subscribe(data => {
        expect(data).toBe(mockUserResponse.user);
        expect((service as any).currentUser).toBe(mockUserResponse.user);
      });

    const req = httpTestingController.expectOne('/api/users/current.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockUserResponse);
  });

  it('should listWeekLogs including days from previous and next month', () => {
    (service as any).currentUser = mockUserResponse.user;
    service.listWeekLogs('2019-08').subscribe((data: WeekLog[]) => {
      expect(data.length).toBe(5);
      data.forEach((week) => {
        expect(week.hoursLogged).toBe(0);
        expect(week.dayLogs.length).toBe(7);
      });
    });

    const req = httpTestingController.expectOne('/api/time_entries.json?user_id=11&spent_on=><2019-07-29|2019-09-01&limit=99');
    expect(req.request.method).toEqual('GET');
    req.flush(mockListEntryResponse);
  });

});
