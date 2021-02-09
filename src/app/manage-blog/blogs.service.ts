import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';

export interface AuthResponseData {
  blogId: string;
  username: String;
  title: string;
  content: string;
  addedDate: Date;
  updateDate: Date;
}

const API = 'https://blog-server-nodejs.herokuapp.com/api/blogs';

@Injectable({
  providedIn: 'root'
})

export class BlogsService {

  constructor(private http: HttpClient, private router: Router) { }

  getblogList(): Observable<any> {
    return this.http.get<AuthResponseData[]>(API + '/blogList').pipe(catchError(this.handleError));
  }

  createPost(title: string, content: string, token: any) {

    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      )
    };
    return this.http
      .post(
        API + '/create',
        {
          title: title,
          content: content
        },
        httpOptions
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  getMyblogList(token: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      )
    };
    return this.http.get<AuthResponseData[]>(API + '/myBlog', httpOptions).pipe(catchError(this.handleError));
  }

  deleteBlogById(id: any, token: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      )
    };
    return this.http.delete(API + '/deleteMyBlog/' + id, httpOptions).pipe(catchError(this.handleError));
  }

  updateBlogById(id: any, title: string, content: string, token: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      )
    };
    return this.http.patch(API + '/updateBlogById/' + id, { title: title, content: content }, httpOptions).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error) {
      case 'INVALID_TOKEN':
        errorMessage = 'Access Denied! Unauthorized User';
        break;
    }
    return throwError(errorMessage);
  }
}
