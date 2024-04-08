import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public retriveAllNotification(){
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.auth.getAllNotification}`);
  }

  login(username: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/${environment.servizi.auth.login}`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  resetPassword(email:string) {
    this.currentUserSubject.next(this.currentUserValue);
    return this.http.get<boolean>(`${environment.apiUrl}/${environment.servizi.auth.resetPassword}/`+email).pipe(
      map((res) => {
        return res;
      })
    );
  }

  CheckJwt() {
    return this.http.get<boolean>(`${environment.apiUrl}/${environment.servizi.auth.checkJWT}`).pipe(
      map((res) => {
        return res;
      })
    );
    // Use RxJS interval operator to execute the HTTP request every minute

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.currentUserSubject.next(this.currentUserValue);
    return this.http.get<string>(`${environment.apiUrl}/${environment.servizi.auth.logout}`).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
