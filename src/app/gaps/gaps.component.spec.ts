import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';

import { GapsComponent } from './gaps.component';
import { RedmineService } from '../redmine.service';
import { DayLog } from '../models/time-entries';
import { dayLog1, dayLog2 } from '../models/time-entries.mock';

const MOCK_DAY_LOGS = [dayLog1, dayLog2];

@Injectable()
class MockRedmineService extends RedmineService {
  listDayLogs(): Observable<DayLog[]> {
    return of(cloneDeep(MOCK_DAY_LOGS));
  }
}

describe('GapsComponent', () => {
  let component: GapsComponent;
  let fixture: ComponentFixture<GapsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GapsComponent ],
      imports: [HttpClientTestingModule],
      providers: [{ provide: RedmineService, useClass: MockRedmineService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
