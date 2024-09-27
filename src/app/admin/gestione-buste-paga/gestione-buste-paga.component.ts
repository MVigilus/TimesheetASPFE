import {Component, OnInit} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "@core";
import {AdminService} from "@core/service/admin.service";
import {FileSystemService} from "@core/service/file-system.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {showNotification} from "@core/utils/functions";
import Swal from "sweetalert2";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {
  FileSearchResultTableComponent
} from "../gestione-file/file-search-result-table/file-search-result-table.component";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {
  BustapagaSearchResultTableComponent
} from "./bustapaga-search-result-table/bustapaga-search-result-table.component";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-gestione-buste-paga',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FileSearchResultTableComponent,
    MatButton,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    BustapagaSearchResultTableComponent,
    MatSlideToggle
  ],
  templateUrl: './gestione-buste-paga.component.html',
  styleUrl: './gestione-buste-paga.component.scss'
})
export class GestioneBustePagaComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

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
      onlyNotAttached:this.onlyNotLoadedBustapaga
    }
      this.subs.sink=this.fileService.submitSearchBustePagaForAdmin(data).subscribe({
        next:(res:any)=>{
          if(res.length>0 || res.length>0){
            this.searchResult=res;
          }else if(!(res.length>1)){
            this.searchResult=[]
            showNotification('red','Nessuna Busta Paga Trovata','top','center',this.snackBar)
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

  private onlyNotLoadedBustapaga:boolean=false;

  setOnlyNotUploadedBustaPaga($event: MatSlideToggleChange) {
    this.onlyNotLoadedBustapaga=$event.checked
  }
}
