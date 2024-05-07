import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
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
import {map} from "rxjs/operators";

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
  /** CRUD METHODS */
  getAllAdvanceTables(): void {
    this.subs.sink = this.httpClient
      .get<Impiegatolist[]>(this.API_URL)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      });
  }

  getAllAdvanceTablesFR(): void {
    this.subs.sink = this.httpClient
      .get<Impiegatolist[]>(this.API_URL_FR)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      });
  }
  addAdvanceTable(advanceTable: Impiegatolist) {

    this.dialogData=convertImpiegatolistToImpiegatoDto(advanceTable);

     return this.httpClient.post(this.API_URL_INSERT, advanceTable).pipe(
       map((result) => {
         return result
       })
     );
  }
  updateAdvanceTable(advanceTable: Impiegatolist) {
    this.dialogData = convertImpiegatolistToImpiegatoDto(advanceTable);

    return this.httpClient.post(this.API_URL_EDIT + advanceTable.id, advanceTable).pipe(
      map((result) => {
        return result
      })
    );

  }
  deleteAdvanceTable(id: number): Observable<any> {

    return this.httpClient.put(this.API_URL_SETFR,id).pipe(
      map((result) => {
        return result
      })
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
