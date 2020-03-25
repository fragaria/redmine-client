import { AppRoutingModule } from './app-routing.module';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('AppRoutingModule', () => {
  let appRoutingModule: AppRoutingModule;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule]
    });
    router = TestBed.inject(Router);
    appRoutingModule = new AppRoutingModule(router);

  });

  it('should create an instance', () => {
    expect(appRoutingModule).toBeTruthy();
  });
});
