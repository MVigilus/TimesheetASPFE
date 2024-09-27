import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {
  TimesheetRicercaDettaglioComponent
} from "../gestione-timesheet/timesheet-ricerca-dettaglio/timesheet-ricerca-dettaglio.component";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {AuthService} from "@core";
import {AdminService} from "@core/service/admin.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {dateLessThan, showNotification} from "@core/utils/functions";
import {MatIcon} from "@angular/material/icon";
import {FileSystemService} from "@core/service/file-system.service";
import Swal from "sweetalert2";
import {FileSearchResultTableComponent} from "./file-search-result-table/file-search-result-table.component";

@Component({
  selector: 'app-gestione-file',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    TimesheetRicercaDettaglioComponent,
    MatError,
    MatIcon,
    FileSearchResultTableComponent
  ],
  templateUrl: './gestione-file.component.html',
  styleUrl: './gestione-file.component.scss'
})
export class GestioneFileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  adminFormSearch:FormGroup;
  optionImpiegato:any[]=[]
  opotionMesi:any[]=[
    { id: 1, option: 'Gennaio' },
    { id: 2, option: 'Febbraio' },
    { id: 3, option: 'Marzo' },
    { id: 4, option: 'Aprile' },
    { id: 5, option: 'Maggio' },
    { id: 6, option: 'Giugno' },
    { id: 7, option: 'Luglio' },
    { id: 8, option: 'Agosto' },
    { id: 9, option: 'Settembre' },
    { id: 10, option: 'Ottobre' },
    { id: 11, option: 'Novembre' },
    { id: 12, option: 'Dicembre' }
  ];
  disableButtonForSubmit:boolean=false;

  optionAnno:any[]=[]


  constructor(private authService:AuthService,
              private adminService:AdminService,
              private fileService:FileSystemService,
              private fb:FormBuilder,
              private router:Router,
              private snackBar:MatSnackBar) {
    super();
    let fullYear = new Date().getFullYear();
    for(let i = 0; i < 100; i++) {
      this.optionAnno.push({ id: fullYear - i });
    }
    this.adminFormSearch=this.fb.group({
      idImpiegato:[' ',[]],
      mese: ['',[]],
      anno: ['',[]],
    });
  }

  reloadOption(){
    this.subs.sink=this.adminService.getAllOptionImpiegatoNames().subscribe({
      next:(res:any)=>{
        if(res[0].id===0){
          this.disableButtonForSubmit=true;
        }
        this.optionImpiegato=res
      }
    })
  }

  searchResult:any[]=[]

  onSubmit() {
    let data = {
      idImpiegato:(this.adminFormSearch.get('idImpiegato')?.value===" ")?null:this.adminFormSearch.get('idImpiegato')?.value,
      mese:(this.adminFormSearch.get('mese')?.value==="")?null:this.adminFormSearch.get('mese')?.value,
      anno:(this.adminFormSearch.get('anno')?.value==="")?null:this.adminFormSearch.get('anno')?.value,
    }
    this.subs.sink=this.fileService.submitSearchAllegatoAndGiustificativo(data).subscribe({
      next:(res:any)=>{
        if(res.length>0 || res.length>0){
          this.searchResult=res;
        }else if(!(res.length>1)){
          this.searchResult=[]
          showNotification('red','Nessun Allegato/Giustificativo presente Trovato','top','center',this.snackBar)
        }
      },
      error:(res) => {
        Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');
      },
      complete:()=>{

      }
    })
  }

  ngOnInit(): void {
    this.reloadOption();
  }

}
