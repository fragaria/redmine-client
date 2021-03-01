import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Issue } from '../models/issues';
import { RedmineService } from '../redmine.service';

import { IssueComponent } from './issue.component';

const MOCK_LAST_LOGGED = 'yesterday';

@Injectable()
class MockRedmineService extends RedmineService {
  getLastTime(): Observable<string> {
    return of(MOCK_LAST_LOGGED);
  }
}

describe('IssueComponent', () => {
  let component: IssueComponent;
  let fixture: ComponentFixture<IssueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueComponent ],
      imports: [HttpClientTestingModule],
      providers: [{ provide: RedmineService, useClass: MockRedmineService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueComponent);
    component = fixture.componentInstance;
    component.issue = new Issue();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
