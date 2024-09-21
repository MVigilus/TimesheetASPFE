import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

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
}
