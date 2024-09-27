import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {FormBuilder, UntypedFormGroup} from "@angular/forms";
import {DatatableComponent, NgxDatatableModule, SortType} from "@swimlane/ngx-datatable";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {FileSystemService} from "@core/service/file-system.service";
import {AuthService} from "@core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {showNotification} from "@core/utils/functions";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import Swal from "sweetalert2";
import {DialogForAttachFilesComponent} from "../../dialog-for-attach-files/dialog-for-attach-files.component";
import {MatButton} from "@angular/material/button";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard-timesheets-riepilogo',
  standalone: true,
  imports: [
    MatButton,
    NgxDatatableModule
  ],
  templateUrl: './dashboard-timesheets-riepilogo.component.html',
  styleUrl: './dashboard-timesheets-riepilogo.component.scss'
})
export class DashboardTimesheetsRiepilogoComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  @Input() checks!: boolean[];

  data: any[] = [];
  dataTable!:any[];



  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;



  columns = [
    { name: 'Periodo Timesheet', prop:"periodo" },
    { name: 'Stato', prop: "stato" },
    { name: 'Busta Paga',prop: "idBustaPaga" },
    { name: 'Giustificativo', prop: "idGiustificativo" },
    { name: 'Allegato', prop: "idallegato" },
  ];

  constructor(private impiegatoService:ImpiegatoService,
              private fileSystemService: FileSystemService,
              protected authService:AuthService,
              ) {
    super();
  }

  ngOnInit(): void {
    this.loading=true

    this.loadTable()
  }

  loadTable(){
    this.subs.sink=this.impiegatoService.getAllTimesheetList().subscribe({
      next:(res)=>{
        this.data=res
        this.loading=false
      }
    })
  }


  loading: boolean = false;


  downloadFile(id: number, prop: string, row:any) {
    switch (prop){
      case 'idGiustificativo':
        this.subs.sink = this.fileSystemService.downloadGiustifivativi(id).subscribe({
          next: (res) => {
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = `giustificativo_${id}_${row.periodo.split(' ').join('')}`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (res) => {
            Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');

          },
          complete: () => {}
        })
        break;
      case 'idBustaPaga':
        this.subs.sink = this.fileSystemService.downloadBustePaga(id).subscribe({
          next: (res) => {
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bustaPaga_${id}_${row.periodo.split(' ').join('')}`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (res) => {
            Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');

          },
          complete: () => {}
        })
        break;
      default:
        this.subs.sink = this.fileSystemService.downloadAllegato(id).subscribe({
          next: (res) => {
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Allegato_${id}_${row.periodo.split(' ').join('')}`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (res) => {
            Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');

          },
          complete: () => {}
        })
        break;
    }
  }

  protected readonly SortType = SortType;
}
