import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DayLog } from '../models/time-entries';

import { GapComponent } from './gap.component';

describe('GapComponent', () => {
  let component: GapComponent;
  let fixture: ComponentFixture<GapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GapComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GapComponent);
    component = fixture.componentInstance;
    component.dayLog = new DayLog();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
