import {Component, OnInit} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {ActivatedRoute, Router} from "@angular/router";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {di} from "@fullcalendar/core/internal-common";
import {AdminService} from "@core/service/admin.service";
import {NgStyle} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {monthsInItalian} from "@core/utils/utils";
import {elements} from "chart.js";

@Component({
  selector: 'app-timesheet-view',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatCell,
    NgStyle,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinner
  ],
  templateUrl: './timesheet-view.component.html',
  styleUrl: './timesheet-view.component.scss'
})
export class TimesheetViewComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  inputColumns = ['Sede', 'Cliente', 'Straordinari', 'Ferie', 'Permessi', 'Altro', 'Totale'];

  periodoTimesheet!:string

  inputData:any = [{}];

  loading:boolean=true;

  displayColumns: string[]=["#"];
  displayData!: MatTableDataSource<any>;

  constructor(private router:ActivatedRoute,
              private adminService:AdminService,
              private navigator:Router) {
    super();
  }

  formatInputRow(row:any,data:any[]) {
    const output:any = {};

    output[1] = row;
    for (let i = 1; i < data.length; ++i) {
      output[data[i].ngiorno] = data[i][row];
    }
    return output;
  }

  giorniRossi:any[]=[]
  impiegatoTimesheet:any={"rimborso":false}
  totKm=0;
  ngiustiicativi=0
  totRimborsoKm=0


// This will output: ["altro", "clienteDest", "clienteOre", "destinazione", "ferie", "id", "kmP", "ngiorno", "permessi", "sede", "straordinari"]
  ngOnInit(): void {
    let id=this.router.snapshot.paramMap.get('id')||0;

    this.subs.sink=this.adminService.getImpiegatoTimesheet(Number(id)).subscribe({
      next:(res:any)=>{
        let dati:any[]=[];
        let rimb:any[]=[];
        let timesheet=res.timeSheet;
        this.impiegatoTimesheet=res.impiegatoDetail;
        this.impiegatoTimesheet.annoT=timesheet.anno;
        this.impiegatoTimesheet.meseT=timesheet.mese;
        this.displayColumns = [...this.displayColumns, ...timesheet.datiTimesheet.map((x:any) => x.ngiorno.toString())];

        ["sede","clienteOre","straordinari","ferie","permessi","altro","Totale", "clienteDest",  "destinazione",  "id", "kmP", "ngiorno" ].forEach(element=>{
          if(!["clienteDest","destinazione","id","kmP","ngiorno"].includes(element)){
            dati.push({"#":element})
          }
        })
        if(this.impiegatoTimesheet.rimborso){
          timesheet.datiTimesheet.forEach((innerElement:any)=>{
            if(innerElement['altro']==='FES'){
              this.giorniRossi.push(innerElement.ngiorno)
            }
            if(innerElement['clienteDest']!=null || innerElement['destinazione']!=null || innerElement['kmP']!=null){
              rimb.push({
                "ngiorno":innerElement['ngiorno'],
                "clienteDest":innerElement['clienteDest']||' ',
                "destinazione":innerElement['destinazione']|| ' ',
                "kmP":innerElement['kmP']
              });
              this.totKm+=Number(innerElement['kmP'])||0;
            }

          });
        }
        console.log("previous");
        console.log(JSON.stringify(dati));
        console.log("timesheeT")
        console.log(JSON.stringify(timesheet.datiTimesheet));

        dati.forEach((element: any, indexd: number) => {
          timesheet.datiTimesheet.forEach((innerElement: any) => {
            if(element['#']!='Totale'){
              element[innerElement.ngiorno] = innerElement[element['#']];
            }else{
              let tot=0;
              ['sede','clienteOre','straordinari','ferie','permessi','altro'].forEach(fieldName => {
                if(fieldName==='altro'){
                  tot+=(innerElement[fieldName]!='' && innerElement[fieldName]!='FES' )?Number(this.impiegatoTimesheet.oreLav):0;
                }else{
                  console.log("GIORNO numero "+innerElement.ngiorno+": "+innerElement[fieldName])
                  console.log("fieldname "+fieldName)
                  console.log(Number(innerElement[fieldName]))
                  tot+=(innerElement[fieldName]!=null)?Number(innerElement[fieldName]):0;
                }
              });
              element[innerElement.ngiorno]=tot;
            }
          });
        });
        console.log(JSON.stringify(dati));

        this.inputColumns.forEach((element,index)=>{
          dati[index]['#']=element
        })
        this.totRimborsoKm=((this.impiegatoTimesheet.rimborsoKm*this.totKm)+this.impiegatoTimesheet.ngiustiicativi)||0;
        this.displayData=new MatTableDataSource(dati)
        this.datiRimborso =new MatTableDataSource(rimb)
        this.loading=false;
      }
    })



  }

  readonly JSON = JSON;
  autore: string='';
  datiRimborso!: MatTableDataSource<any>;
  headerRimborso:string[]=["ngiorno","clienteDest","destinazione","kmP"];

  assingColor(element:any, idx: number) {
    let style:any ={}
    if (this.giorniRossi.includes(idx) && element[this.displayColumns[0]]!='Totale'){
      style['background-color']='red'
    }else if(element[this.displayColumns[0]]=='Totale' && idx!=0){
      style['background-color']='orange'
    }

    if(idx==0){
      style['font-weight'] = 'bold';
    }
    return style;

  }


  autorizza() {
    this.loading=true
    this.subs.sink=this.adminService.ApprovaTimesheet(Number(this.router.snapshot.paramMap.get('id')||0)).subscribe({
      next:(res)=>{
        Swal.fire('Timesheet approvato con successo!', 'è stata inviata un notifica e una mail all\'operatore', 'success');
        this.navigator.navigate(['admin/gestionetimesheet'])
      },
      error:(res)=>{
        Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');
        this.loading=false
      }
    })
  }

  rifiuta() {
    this.subs.sink=this.adminService.RifiutaTimesheet(Number(this.router.snapshot.paramMap.get('id')||0)).subscribe({
      next:(res)=>{
        Swal.fire('Timesheet rifiutato con successo!', 'è stata inviata un notifica e una mail all\'operatore', 'success');
        this.navigator.navigate(['admin/gestionetimesheet'])
      },
      error:(res)=>{
        Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');
        this.loading=false
      }
    })
  }

  protected readonly monthsInItalian = monthsInItalian;

  StampaTimesheet() {

  }

  StampaRimborso() {

  }
}
