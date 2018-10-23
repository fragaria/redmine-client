import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RedmineService } from '../redmine.service';
import { User } from '../dto/users';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private redmine: RedmineService,
    private router: Router,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(""/*, Validators.required*/),
      password: new FormControl(""/*, Validators.required*/)
    });
  }

  authenticate(): void {
    this.redmine.authenticate(this.loginForm.value.username, this.loginForm.value.password).subscribe(user => {
      this.appComponent.setUsername(user.firstname);
      this.router.navigateByUrl('home')
    });
  }

}
