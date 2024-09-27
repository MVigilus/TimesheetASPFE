import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StatChartService {

  constructor(private http:HttpClient) { }

  public fetchAdminResiduoGeneraleChart(){
    return this.http.get<any[]>(`${environment.apiUrl}/${environment.servizi.admin.getResiduoGenerale}`)
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  fetchImpiegatoOrePFStat() {
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.impiegato.fetchBarChart}`)
  }

  fetchImpiegatoPieChart() {
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.impiegato.fetchPieChart}`)
  }

  public fetchAdminResiduoPrecChart(){
    return this.http.get<any[]>(`${environment.apiUrl}/${environment.servizi.admin.getResiduoPrec}`)
      .pipe(
        map((result) => {
          return result
        })
      );
  }


  public fetchAdminResiduoAttChart(){
    return this.http.get<any[]>(`${environment.apiUrl}/${environment.servizi.admin.getResiduoAtt}`)
      .pipe(
        map((result) => {
          return result
        })
      );
  }
}
