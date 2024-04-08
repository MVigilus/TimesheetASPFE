import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {AuthService} from "@core";
import {AdminService} from "@core/service/admin.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import moment, {Moment} from "moment/moment";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {TimesheetRicercaDettaglioComponent} from "./timesheet-ricerca-dettaglio/timesheet-ricerca-dettaglio.component";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {MY_FORMATS} from "@core/utils/formats";
import {dateLessThan, showNotification} from "@core/utils/functions";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-gestione-timesheet',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    MatSuffix,
    MatButton,
    TimesheetRicercaDettaglioComponent
  ],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: './gestione-timesheet.component.html',
  styleUrl: './gestione-timesheet.component.scss'
})
export class GestioneTimesheetComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  optionImpiegato:any[]=[]
  noSearch=false
  optionPeriod:any[]=[]

  adminFormSearch:FormGroup;

  constructor(private authService:AuthService,
              private adminService:AdminService,
              private fb:FormBuilder,
              private router:Router,
              private snackBar:MatSnackBar) {
    super();
    this.adminFormSearch=this.fb.group({
      impiegato:[' ',[]],
      period: [' ',[]],
      periodStart: [],
      periodEnd: []
    },{ validator: dateLessThan('periodStart', 'periodEnd') });
    this.adminFormSearch.controls['period'].disable();
    this.adminFormSearch.controls['periodEnd'].disable();
  }

  reloadOption(){
    this.subs.sink=this.adminService.getAllOptionImpiegatoNames().subscribe({
      next:(res)=>{
        this.optionImpiegato=res
      }
    })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>,period:string) {
    const ctrlValue = this.adminFormSearch.get(period)!.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    ctrlValue.locale('it');
    this.adminFormSearch.get(period)!.setValue(ctrlValue);
    datepicker.close();
  }

  ngOnInit(): void {
    this.reloadOption()
    this.subs.sink = this.adminFormSearch.get('impiegato')!.valueChanges.subscribe((selectedOption) => {
      this.results=[];
      if (selectedOption===' ' || selectedOption===0) {
        this.adminFormSearch.controls['period'].disable();
      }else{
        this.subs.sink=this.adminService.getAllOptionImpiegatoTimesheet(selectedOption).subscribe({
          next:(res)=>{
            this.optionPeriod=res;
          }
        })
        this.adminFormSearch.controls['periodStart'].setValue(null)
        this.adminFormSearch.controls['periodEnd'].setValue(null)
        this.adminFormSearch.controls['period'].enable();
      }
    });
    this.subs.sink = this.adminFormSearch.get('period')!.valueChanges.subscribe((selectedOption) => {
      this.results=[];
      if (selectedOption!=' ' || selectedOption!=0) {
        this.adminFormSearch.controls['periodStart'].disable();
        this.adminFormSearch.controls['periodEnd'].disable();
      }else{
        this.adminFormSearch.controls['periodStart'].enable();

      }
    });
    this.subs.sink = this.adminFormSearch.get('periodStart')!.valueChanges.subscribe((selectedOption) => {
      this.results=[];

      if (selectedOption===null) {
        this.adminFormSearch.controls['periodEnd'].disable();
      }else{
        this.adminFormSearch.controls['periodEnd'].enable();
      }
    });
  }

  public results:any[]=[];

  onSubmit() {
    if(this.adminFormSearch.get('period')?.value===' ' || this.adminFormSearch.get('period')?.value===0){
      let selectedDate = [this.adminFormSearch.get('periodStart')?.value,this.adminFormSearch.get('periodEnd')?.value];
      let period=[(selectedDate[0])?selectedDate[0].month() + 1+"-"+selectedDate[0].year():null,(selectedDate[1])?selectedDate[1].month() + 1+"-"+selectedDate[1].year():null]
      this.subs.sink=this.adminService.submitSearchTImesheet({
        "periodFrom":period[0],
        "periodTo":period[1],
        "idImpiegato":this.adminFormSearch.get('impiegato')?.value
      }).subscribe({
        next:(res:any[])=>{
          this.results=res;
          if (!this.results){
            showNotification('red','Nessun TImesheet Trovato','top','center',this.snackBar)
          }
        }
      })
    }else{
      this.noSearch=false;
      this.ViewTimesheet(this.adminFormSearch.get('period')?.value)
    }
  }

  ViewTimesheet(id:number) {
    this.router.navigate(['/admin/timesheet/'+id])
  }
}
