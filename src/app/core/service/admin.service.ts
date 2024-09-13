import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  public getAllRole() {
    return this.http.get<string[]>(`${environment.apiUrl}/${environment.servizi.admin.getAllRole}`)
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  public getAllOptionImpiegatoNames(){
    return this.http.get<string[]>(`${environment.apiUrl}/${environment.servizi.admin.getAllTimesheetOption}`)
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  public ApprovaTimesheet(id:number) {
    return this.http.put<string>(`${environment.apiUrl}/${environment.servizi.admin.approvaTimesheet}`+id,{})
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  public RifiutaTimesheet(id:number) {
    return this.http.put<string>(`${environment.apiUrl}/${environment.servizi.admin.rifiutaTimesheet}`+id,{})
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  public getAllOptionImpiegatoTimesheet(id:number){
    return this.http.get<string[]>(`${environment.apiUrl}/${environment.servizi.admin.getAllTimesheetOption}/`+id)
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  public getImpiegatoTimesheet(id:number){
    return this.http.get<string[]>(`${environment.apiUrl}/${environment.servizi.admin.getTImesheetById}`+id)
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  public submitSearchTImesheet(data:any){
    return this.http.post<any[]>(`${environment.apiUrl}/${environment.servizi.admin.submitSearchTImesheet}`, data)
      .pipe(
        map((result) => {
          return result
        })
      );
  }
}
