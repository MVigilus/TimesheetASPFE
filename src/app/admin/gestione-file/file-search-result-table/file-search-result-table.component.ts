import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {DatatableComponent, NgxDatatableModule, SortType} from "@swimlane/ngx-datatable";
import Swal from "sweetalert2";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {FileSystemService} from "@core/service/file-system.service";

@Component({
  selector: 'app-file-search-result-table',
  standalone: true,
    imports: [
        MatButton,
        MatMiniFabButton,
        NgxDatatableModule
    ],
  templateUrl: './file-search-result-table.component.html',
  styleUrl: './file-search-result-table.component.scss'
})
export class FileSearchResultTableComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @Input() data: any[] = [];
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  filteredData: any[] = [];

  constructor(private fileSystemService: FileSystemService) {
    super();
  }


  columns = [
    { name: 'Timesheet di riferimento', prop:"periodo" },
    { name: 'Allegato', prop: "idAllegato" },
    { name: 'Giustificativo', prop: "idGiustificativo" },
    { name: 'Caricato da', prop: "uploadedBy" },
  ];
  protected readonly SortType = SortType;

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
}
