import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {DatatableComponent, NgxDatatableModule, SortType} from "@swimlane/ngx-datatable";
import {FileSystemService} from "@core/service/file-system.service";
import Swal from "sweetalert2";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {
  DialogForAttacchBustaPagaComponent
} from "../../gestione-timesheet/dialog-for-attacch-busta-paga/dialog-for-attacch-busta-paga.component";
import {MatDialog} from "@angular/material/dialog";
import {Impiegatolist} from "@core/models/admin/impiegatolist.model";
import {confirmModal} from "@core/utils/functions";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-bustapaga-search-result-table',
  standalone: true,
  imports: [
    MatButton,
    MatMiniFabButton,
    NgxDatatableModule,
    DatePipe
  ],
  templateUrl: './bustapaga-search-result-table.component.html',
  styleUrl: './bustapaga-search-result-table.component.scss'
})
export class BustapagaSearchResultTableComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @Input() data: any[] = [];
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  @Output() eventAddOrDelete = new EventEmitter<any>();

  filteredData: any[] = [];

  constructor(private fileSystemService: FileSystemService,
              private dialogModel: MatDialog,
  ) {
    super();
  }


  columns = [
    { name: 'Timesheet di riferimento', prop:"periodo" },
    { name: 'BustaPaga', prop: "idBustaPaga" },
    { name: 'Caricato da', prop: "uploadedBy" },
    { name: 'Data Caricamento', prop: "dataCaricamento" },
    { name: 'Impiegato', prop: "impiegato" },
  ];

  downloadFile(id: number, row:any) {
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
  }

  deleteBustaPaga(row:any){
    let title=""
    confirmModal('Sei sicuro di voler eliminare il file?',row.nominativo)
      .then((res)=>{
        if (res.value) {
          this.fileSystemService.deleteBustaPaga(row.idTimesheet).subscribe({
            next:(res)=>{
              Swal.fire('Busta Paga Eliminata!', ' la busta paga è stata eliminata con successo ', 'success');
            },
            error:(res)=>{
              Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');
            },
            complete:()=>{
              this.eventAddOrDelete.emit(true);
            }
          })
        }
      });
  }

  openModalForAttachFile(row:any) {
    this.dialogModel.open(DialogForAttacchBustaPagaComponent, {
      width: '1280px',
      disableClose: false,
      data: { timesheet: row }
    });
  }

  filterDatatable(event: Event) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    const colsAmt = this.columns.length;
    if(val!=''){
      this.data = this.filteredData.filter(function (item: any) {
        for (let i = 0; i < colsAmt; i++) {
          if (
            item.periodo.toString().toLowerCase().indexOf(val) !== -1 ||
            !val
          ) {
            // found match, return true to add to result set
            return true;
          }
        }
        return false;
      });
    }else{
      this.data=this.filteredData;
    }

    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit(): void {
  }

  protected readonly SortType = SortType;
  protected readonly Date = Date;
}
