import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor(private http:HttpClient) { }

  downloadGiustifivativi(id:number){
    return this.http.get(`${environment.apiUrl}/${environment.servizi.file.downloadGiustificativi}/`+id, { responseType: 'blob' })

  }
  downloadAllegato(id:number){
    return this.http.get(`${environment.apiUrl}/${environment.servizi.file.downloadAllegati}/`+id, { responseType: 'blob' })

  }
  downloadBustePaga(id:number){
    return this.http.get(`${environment.apiUrl}/${environment.servizi.file.downloadBustePaga}/`+id, { responseType: 'blob' })

  }

  public submitSearchAllegatoAndGiustificativo(data:any){
    return this.http.post<any[]>(`${environment.apiUrl}/${environment.servizi.file.getAllegatiAndGiustificativi}`, data)
      .pipe(
        map((result) => {
          return result
        })
      );
  }

  public submitSearchBustePagaForAdmin(data:any){
    return this.http.post<any[]>(`${environment.apiUrl}/${environment.servizi.file.getBustePagaAdmin}`, data)
      .pipe(
        map((result) => {
          return result
        })
      );
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

  public submitBustaPagaTimesheet(id:number,file:FormData){
    const headers = new HttpHeaders({
      // Do not set Content-Type header; Angular will set it to multipart/form-data automatically
    });
    return this.http.post(`${environment.apiUrl}/${environment.servizi.file.submitBustaPagaFile}/${id}`, file, { headers });

  }


  deleteBustaPaga(id:any) {
    return this.http.delete(`${environment.apiUrl}/${environment.servizi.file.deleteBustaPaga}/`+id)
  }
}
