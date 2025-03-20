import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {Impiegatolist} from "@core/models/admin/impiegatolist.model";
import {environment} from "../../../environments/environment";
import {ImpiegatoDto} from "@core/models/admin/ImpiegatoDto.model";
import {
  convertImpiegatoDtoToImpiegatolist,
  convertImpiegatolistToImpiegatoDto
} from "@core/converters/ImpiegatoDtoConverter.converter";
import Swal from "sweetalert2";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})

export class AdvanceTableService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = `${environment.apiUrl}/${environment.servizi.admin.getAllImpiegato}`;
  private readonly API_URL_FR = `${environment.apiUrl}/${environment.servizi.admin.getAllImpiegatoFR}`;
  private readonly API_URL_INSERT = `${environment.apiUrl}/${environment.servizi.admin.insertImpiegato}`;
  private readonly API_URL_EDIT = `${environment.apiUrl}/${environment.servizi.admin.editImpiegato}/`;
  private readonly API_URL_SETFR = `${environment.apiUrl}/${environment.servizi.admin.setFR}`;
  private readonly API_URL_DELETE = `${environment.apiUrl}/${environment.servizi.admin.deleteImp}`;
  isTblLoading = true;
  dataChange: BehaviorSubject<Impiegatolist[]> = new BehaviorSubject<
    Impiegatolist[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: ImpiegatoDto;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Impiegatolist[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return convertImpiegatoDtoToImpiegatolist(this.dialogData);
  }


  private handleError(error: HttpErrorResponse) {
    // Customize this method based on your needs
    return throwError(
      () => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      }
    );
  }

  /** GET: Fetch all advance tables */
  getAllAdvanceTables(): Observable<Impiegatolist[]> {
    return this.httpClient
      .get<Impiegatolist[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  getAllAdvanceTablesFR(): Observable<Impiegatolist[]> {
    return this.httpClient
      .get<Impiegatolist[]>(this.API_URL_FR)
      .pipe(catchError(this.handleError));
  }
  addAdvanceTable(advanceTable: Impiegatolist) {

    this.dialogData=convertImpiegatolistToImpiegatoDto(advanceTable);

     return this.httpClient.post(this.API_URL_INSERT, advanceTable).pipe(
       map((result) => {
         return result
       })
     );
  }
  updateAdvanceTable(advanceTable: Impiegatolist): Observable<any> {
    return this.httpClient.post(this.API_URL_EDIT + advanceTable.id, advanceTable).pipe(
      map((response) => {
        return advanceTable; // return response from API
      }),
      catchError(this.handleError)
    );
  }

  deleteAdvanceTable(id: number): Observable<number> {
    return this.httpClient.put(`${this.API_URL_SETFR}`,id).pipe(
      map((response) => {
        return id; // return response from API
      }),
      catchError(this.handleError)
    );
  }


  deleteAdvanceTableImp(id: number): Observable<any> {

    return this.httpClient.delete(this.API_URL_DELETE+'/'+id).pipe(
      map((result) => {
        return result
      })
    );
  }
}
