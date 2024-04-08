import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatMiniFabButton} from "@angular/material/button";
import {DatatableComponent, NgxDatatableModule, SortType} from "@swimlane/ngx-datatable";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {MatIconModule} from "@angular/material/icon";
import {AdminService} from "@core/service/admin.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-timesheet-ricerca-dettaglio',
  standalone: true,
  imports: [
    MatMiniFabButton,
    MatIconModule,
    NgxDatatableModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
  ],
  templateUrl: './timesheet-ricerca-dettaglio.component.html',
  styleUrl: './timesheet-ricerca-dettaglio.component.scss'
})
export class TimesheetRicercaDettaglioComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  @Input() checks!: boolean[];

  @Input() data: any[] = [];
  @Output() eventIdTimesheet = new EventEmitter<any>();
  dataTable!:any[];

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  filteredData: any[] = [];


  columns = [
    { name: 'Nominativo', prop:"nominativo"},
    { name: 'Periodo Timesheet', prop:"periodo" },
    { name: 'Stato', prop: "status" },
    { name: 'Busta Paga',prop: "idBustaPaga" },
    { name: 'Giustificativo', prop: "idGiustificativo" },
    { name: 'Allegato', prop: "idAllegato" },
  ];

  constructor(private adminService:AdminService) {
    super();
  }

  ngOnInit(): void {
    this.filteredData=this.data;

  }

  filterDatatable(event: Event) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    const colsAmt = this.columns.length;
    if(val!=''){
      this.data = this.filteredData.filter(function (item: any) {
        for (let i = 0; i < colsAmt; i++) {
          if (
            item.nominativo.toString().toLowerCase().indexOf(val) !== -1 ||
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

  protected readonly SortType = SortType;
  protected readonly JSON = JSON;

  openTimesheet(idTimesheet: number) {
    this.eventIdTimesheet.emit({'data':idTimesheet})
  }
}
