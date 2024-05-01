import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {DatatableComponent, NgxDatatableModule, SortType} from "@swimlane/ngx-datatable";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {AdminService} from "@core/service/admin.service";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TimesheetDettaglioComponent} from "../timesheet-dettaglio/timesheet-dettaglio.component";
import {AuthService} from "@core";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {showNotification} from "@core/utils/functions";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";

@Component({
  selector: 'app-riepilogo-timesheet',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatMiniFabButton,
    NgxDatatableModule,
    MatButton,
    MatProgressSpinner,
    TimesheetDettaglioComponent,
    MatSlideToggle,
    ReactiveFormsModule,
    FormsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  templateUrl: './riepilogo-timesheet.component.html',
  styleUrl: './riepilogo-timesheet.component.scss'
})
export class RiepilogoTimesheetComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  @Input() checks!: boolean[];

  data: any[] = [];
  dataTable!:any[];

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  filteredData: any[] = [];


  columns = [
    { name: 'Periodo Timesheet', prop:"periodo" },
    { name: 'Stato', prop: "stato" },
    { name: 'Busta Paga',prop: "idBustaPaga" },
    { name: 'Giustificativo', prop: "idGiustificativo" },
    { name: 'Allegato', prop: "idallegato" },
  ];

  constructor(private impiegatoService:ImpiegatoService,
              protected authService:AuthService,
              private snackBar:MatSnackBar) {
    super();
  }

  ngOnInit(): void {
    this.loading=true
    this.rimanezaPermesso=this.authService.currentUserValue.anagraficaLavorativa[0].giorniPermesso
    this.rimanezaFerie=this.authService.currentUserValue.anagraficaLavorativa[0].giorniFerie

    this.loadTable()
  }

  loadTable(){
    this.subs.sink=this.impiegatoService.getAllTimesheetList().subscribe({
      next:(res)=>{
        this.data=res
        this.filteredData=this.data;
        this.loading=false
      }
    })
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

  protected readonly SortType = SortType;
  protected readonly JSON = JSON;

  loading: boolean = false;
  timesheet:any=null;

  rimanezaPermesso:number=0;
  rimanezaFerie:number=0;
  totKm:number=0
  automaticSave=false;
  totRimborsoKm:number=0
  checkedFR:boolean=false;
  ngiustificativi: number=0;

  updateNgiustificativi($event: any) {
    this.subs.sink=this.impiegatoService.submitNgiustificativi(Number($event.target.value),this.timesheet.id).subscribe({
      next:(res)=>{
        showNotification('accent','Giustificativi aggiornati con successo','top','center',this.snackBar)
      }
    })

  }

  UpdateFieldTimesheet(data: any) {
    this.timesheet.datiTimesheet[data.index][data.field]=data.dato;
    if(this.automaticSave){
      this.subs.sink= this.impiegatoService.submitDatoTImesheet(this.timesheet.datiTimesheet[data.index]).subscribe({
        next:(res:any)=>{
          console.log(res)
        }
      })
    }
  }

  setAutomaticSave($event: MatSlideToggleChange) {
    this.automaticSave=$event.checked
  }

  setSlide($event: MatSlideToggleChange) {
    this.checkedFR=$event.checked
  }

  getKmPercorsiFromChild(data:any){
    this.totKm+=data.km
    this.totRimborsoKm+=(data.km*this.authService.currentUserValue.rimborsoKm)
  }

  minusKmPercorsiFromChild(data:any){
    this.totKm-=data.km
    this.totRimborsoKm-=(data.km*this.authService.currentUserValue.rimborsoKm)
  }

  minusOrePermesso(data:any) {
    this.rimanezaPermesso=data.action
  }

  minusOreFerie(data:any) {
    this.rimanezaFerie=data.action
  }

  openTimesheet(idTimesheet: number) {
    this.loading=true
    this.subs.sink= this.impiegatoService.submitPeriodoTimesheet(idTimesheet).subscribe({
      next:(res)=>{
        this.timesheet=res;
        this.loading=false
      },
      error:(res)=>{
        console.log("CIIIIAOOOOO")
        this.loading=false
      }
    })
  }

  onSubmitTimesheet(){
    this.loading=true;
    this.subs.sink = this.impiegatoService.submitTimesheet(this.timesheet).subscribe({
      next: (res) => {
        Swal.fire('Timesheet inviato con successo!', 'timesheet spedito ed in attesa di revisione, le arriverà una mail contenente in dettaglio per la tracciabilità', 'success');
        this.timesheet=null
        this.loadTable()
        this.loading=false
      },
      error:(res)=>{
        Swal.fire('Errore generico!', 'Riprovare piu tardi', 'error');
        this.loading=false
      }
    });
  }
  panelOpenState: boolean=true;


  checkTimesheetIsValid():boolean {
    let ret=true;
    this.timesheet.datiTimesheet.forEach((rowData:any)=>{
      let totOre=0;
      Object.keys(rowData).forEach((fieldName)=>{
        if(['sede','clienteOre','straordinari','ferie','permessi','altro'].includes(fieldName)){
          if(fieldName==='altro'){
            totOre+=(rowData[fieldName]!='')?this.authService.currentUserValue.oreLavorative:0;
          }else{
            totOre+=Number(rowData[fieldName])||0;
          }
        }
      })
      if(totOre<this.authService.currentUserValue.oreLavorative){
        ret=false;
      }
    });
    return ret;
  }

  back() {
    this.timesheet=null
    this.loadTable()
  }

  AllegaGius() {

  }
}
