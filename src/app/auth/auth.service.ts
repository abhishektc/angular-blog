import { User } from './user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

export interface AuthResponseData {
  userId: string;
  username: string;
  token: string;
  expiresIn: number;
}

const API = 'https://blog-server-nodejs.herokuapp.com/api/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  userInfo: {
    userId: string;
    username: string;
    tokenData: string;
    expirationDate: string;
  } = JSON.parse(localStorage.getItem('userData'));

  user = new BehaviorSubject<any>(!!this.userInfo ? this.userInfo : null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        API + '/signup',
        {
          username: username,
          password: password,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.userId,
            resData.username,
            resData.token,
            resData.expiresIn
          );
        })
      );
  }

  login(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        API + '/login',
        {
          username: username,
          password: password,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.userId,
            resData.username,
            resData.token,
            resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      userId: string;
      username: string;
      tokenData: string;
      expirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.userId,
      userData.username,
      userData.tokenData,
      new Date(userData.expirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.expirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['/auth']);
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    userId: string,
    username: string,
    token: string,
    expiresIn: number
  ) {

    const expirationDate = new Date(expiresIn * 1000);

    const user = new User(userId, username, token, expirationDate);

    this.user.next(user);

    this.autoLogout(expiresIn * 1000 - new Date().getTime());
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error) {
      case 'USERNAME_EXISTS':
        errorMessage = 'This username exists already';
        break;
      case 'USERNAME_NOT_FOUND':
        errorMessage = 'This username does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
