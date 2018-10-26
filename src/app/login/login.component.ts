import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RedmineService } from '../redmine.service';
import { User } from '../models/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() username = new EventEmitter<string>();

  loginForm: FormGroup;

  constructor(
    private redmine: RedmineService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(""/*, Validators.required*/),
      password: new FormControl(""/*, Validators.required*/)
    });
  }

  authenticate() {
    this.redmine.authenticate(this.loginForm.value.username, this.loginForm.value.password).subscribe(user => {
      this.username.emit(user.firstname);
      this.router.navigateByUrl(this.router.url);
    });
  }

}
