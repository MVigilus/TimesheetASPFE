import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImpiegatoService {

  constructor(private http:HttpClient) { }

  public getAllTimesheetOptionList(){
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.impiegato.getAllTimesheetOption}`)
  }
  public getAllTimesheetList(){
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.impiegato.getAllTimesheetLogged}`)
  }
  public submitYearMonthTimesheetSearch(data:any){
    return this.http.post<any>(`${environment.apiUrl}/${environment.servizi.impiegato.submitPeriodTimesheet}`, data);
  }
  public submitPeriodoTimesheet(id:number){
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.impiegato.submitOptionTimesheet}`+id);
  }
  public submitDatoTImesheet(dato:any){
    return this.http.put<any>(`${environment.apiUrl}/${environment.servizi.impiegato.submitDatoTimesheet}`,dato)
  }
  public submitTimesheetNoSave(id:number){
    return this.http.get<any>(`${environment.apiUrl}/${environment.servizi.impiegato.submitTimesheetNoSave}`+id)
  }
  public submitTimesheet(dato:any){
    return this.http.put<any>(`${environment.apiUrl}/${environment.servizi.impiegato.submitTimesheet}`,dato)
  }
  public submitNgiustificativi(dato:number,id:number){
    return this.http.put<any>(`${environment.apiUrl}/${environment.servizi.impiegato.updateNgiustificativo}`+id, dato)
  }
  public submitGiustificativoTimesheet(id:number,file:FormData){
    const headers = new HttpHeaders({
      // Do not set Content-Type header; Angular will set it to multipart/form-data automatically
    });
    return this.http.post(`${environment.apiUrl}/${environment.servizi.file.submitGiustificativoFiles}/${id}`, file, { headers });

  }

  public submitAllegatoTimesheet(id:number,file:FormData,comment:String){
    const headers = new HttpHeaders({
      // Do not set Content-Type header; Angular will set it to multipart/form-data automatically
    });
    const allegato = {
      file : file,
      comment : comment,
      idTimesheet : id
    }
    return this.http.post(`${environment.apiUrl}/${environment.servizi.file.submitAllegatoFile}`, allegato, { headers });

  }
}
