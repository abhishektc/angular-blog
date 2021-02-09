import { AuthService, AuthResponseData } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, NgForm, Validators, FormBuilder } from '@angular/forms';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
  isLoading = false;
  loginMode = true;
  error: string;
  hide: boolean = true;
 
  userForm = this.fb.group({
    username: new FormControl('', [Validators.required, Validators.compose([Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(4), Validators.maxLength(18)])]),
    password:new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
  });

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let auth: Observable<AuthResponseData>;
    const username = this.userForm.get('username').value;
    const password = this.userForm.get('password').value;

    this.isLoading = true;

    if (this.loginMode) {
      auth = this.authService.login(username, password);
    } else {
      auth = this.authService.signup(username, password);
    }

    auth.subscribe(
      data => {
        this.isLoading = false;
        this.openSnackBar('Successfully login.');
        this.router.navigate(['blogs']);
      },
      error => {
        this.error = error;
        this.openSnackBar(this.error);
        this.isLoading = false;
      }
    );
    this.userForm.reset();
  }

  openSnackBar(val: string) {
    this._snackBar.open(val, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

}

