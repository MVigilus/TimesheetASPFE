import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {map} from 'rxjs/operators';
import {ChipsDTO} from "@shared/components/ChipsDTO";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  private currentUserSignal: WritableSignal<User>; // Use WritableSignal for manual updates

  constructor(private http: HttpClient) {
    const initialUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject = new BehaviorSubject<User>(initialUser);
    this.currentUserSignal = signal(initialUser);

    this.currentUserSubject.subscribe((user) => {
      this.currentUserSignal.set(user);
    });
  }

  public get currentUserValue(): User {
    return this.currentUserSignal();
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
          this.currentUserSubject.next(user); // This will trigger the signal update
          return user;
        })
      );
  }

  resetPassword(email:string) {
    this.currentUserSubject.next(this.currentUserValue);
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.auth.resetPassword}/`+email).pipe(
      map((res) => {
        return res;
      })
    );
  }

  setPassword(newPassword:any){
    return this.http.post<any>(`${environment.apiUrl}/${environment.servizi.auth.setPassword}`,newPassword).pipe(
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

  public fetchChipsForDashboard(){
    return this.http.get<ChipsDTO[]>(`${environment.apiUrl}/${environment.servizi.auth.fetchChipsForDashboard}`).pipe(
      map((res) => {
        return res;
      })
    );
  }


  logout() {
    localStorage.clear();
    this.currentUserSubject.next({} as User); // This will trigger the signal update
    return this.http.get<string>(`${environment.apiUrl}/${environment.servizi.auth.logout}`).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
