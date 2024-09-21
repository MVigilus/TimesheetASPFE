import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {
  MatDatepicker,
  MatDatepickerInput, MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import moment, {Moment} from "moment";
import {MY_FORMATS} from "@core/utils/formats";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TimesheetDettaglioComponent} from "../timesheet-dettaglio/timesheet-dettaglio.component";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {MonthYearPipe} from "@core/utils/pipes/month-year.pipe";
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {AuthService} from "@core";
import Swal from "sweetalert2";
import {monthsInItalian} from "@core/utils/utils";
import {showNotification} from "@core/utils/functions";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";

@Component({
  selector: 'app-ricerca-timesheet',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDatepickerModule,
        BreadcrumbComponent,
        MatProgressSpinner,
        TimesheetDettaglioComponent,
        MatSlideToggle,
        MonthYearPipe,
        MatExpansionModule,
        FormsModule,
        FileUploadComponent,


    ],
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: './ricerca-timesheet.component.html',
  styleUrl: './ricerca-timesheet.component.scss'
})
export class RicercaTimesheetComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  YearMonthSearch: FormGroup;

  options:any[];

  timesheet:any=null;
  fileUploadForm: UntypedFormGroup;
  laoding:boolean=false;

  constructor(private fb:FormBuilder,
              private impiegatoService:ImpiegatoService,
              protected authService:AuthService,
              private snackBar: MatSnackBar,
              ) {
    super();
    this.YearMonthSearch=this.createUntypeForm();
    this.fileUploadForm = fb.group({
      uploadFile: [''],
    });
    this.options=[]
  }

  createUntypeForm(){
    return this.fb.group({
      yearMonth:['',[]],
      selectPeriod: [moment().locale('it')]
    })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.YearMonthSearch.get('selectPeriod')!.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    ctrlValue.locale('it');
    this.YearMonthSearch.get('selectPeriod')!.setValue(ctrlValue);
    datepicker.close();
  }

  loadOption(){
  this.subs.sink = this.impiegatoService.getAllTimesheetOptionList().subscribe({
    next: (res) => {
      this.options = res;
    }
  })
}

  ngOnInit(): void {

    this.rimanezaPermesso=this.authService.currentUserValue.anagraficaLavorativa[0].giorniPermesso
    this.rimanezaFerie=this.authService.currentUserValue.anagraficaLavorativa[0].giorniFerie
    this.loadOption();
    this.subs.sink = this.YearMonthSearch.get('yearMonth')!.valueChanges.subscribe((selectedOption) => {
      if (selectedOption!=' ') {
        this.YearMonthSearch.controls['selectPeriod'].disable(); // assuming that the input name is 'newPeriod'
      }else{
        this.YearMonthSearch.controls['selectPeriod'].enable();
      }
    });
  }

  onSubmitTimesheet(){
    this.laoding=true;
    this.subs.sink = this.impiegatoService.submitTimesheet(this.timesheet).subscribe({
      next: (res) => {
        Swal.fire('Timesheet inviato con successo!', 'timesheet spedito ed in attesa di revisione', 'success');
        this.timesheet=null
        this.loadOption()
        this.laoding=false
      },
      error:(res)=>{
        Swal.fire('Errore generico!', 'Riprovare piu tardi', 'error');
        this.laoding=false
      }
    });
  }

  onSubmit() {
    this.laoding=true;
    if(this.YearMonthSearch.get('yearMonth')?.value===' ' || this.YearMonthSearch.get('yearMonth')?.value===''){
      let selectedDate = this.YearMonthSearch.get('selectPeriod')!.value;
      let month = selectedDate.month() + 1;
      let year = selectedDate.year();

      console.log('Year:', year, 'Month:', month);
      this.subs.sink = this.impiegatoService.submitYearMonthTimesheetSearch({"year":year,"month":month}).subscribe({
        next:(res)=>{
          this.timesheet=res;
          this.laoding=false
        },
        error:(res)=>{
          Swal.fire('Ops Qualcosa è andato storto', '', 'error');
          this.laoding=false
        }
      })

    }else{
      this.subs.sink= this.impiegatoService.submitPeriodoTimesheet(this.YearMonthSearch.get('yearMonth')!.value).subscribe({
        next:(res)=>{
          this.timesheet=res;
          this.laoding=false

        },
        error:(res)=>{
          console.log("CIIIIAOOOOO")
          this.laoding=false
        }
      })
    }
    this.rimanezaPermesso=this.authService.currentUserValue.anagraficaLavorativa[0].giorniPermesso
    this.rimanezaFerie=this.authService.currentUserValue.anagraficaLavorativa[0].giorniFerie
  }

  protected readonly JSON = JSON;
  checkedFR:boolean=false;
  panelOpenState: boolean=true;
  totKm:number=0
  totRimborsoKm:number=0
  automaticSave=false;

  setSlide($event: MatSlideToggleChange) {
    this.checkedFR=$event.checked
  }

  setAutomaticSave($event: MatSlideToggleChange) {
    this.automaticSave=$event.checked
  }

  getKmPercorsiFromChild(data:any){
    this.totKm+=data.km
    this.totRimborsoKm+=(data.km*this.authService.currentUserValue.rimborsoKm)
  }

  minusKmPercorsiFromChild(data:any){
    this.totKm-=data.km
    this.totRimborsoKm-=(data.km*this.authService.currentUserValue.rimborsoKm)
  }

  back() {
    this.timesheet=null;
    this.loadOption();
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

  protected readonly monthsInItalian = monthsInItalian;
  ngiustificativi: number=0;

  updateNgiustificativi($event: any) {
    this.subs.sink=this.impiegatoService.submitNgiustificativi(Number($event.target.value),this.timesheet.id).subscribe({
      next:(res)=>{
        showNotification('accent','Giustificativi aggiornati con successo','top','center',this.snackBar)
      }
    })

  }

  rimanezaPermesso:number=0;
  rimanezaFerie:number=0;

  minusOrePermesso(data:any) {
    this.rimanezaPermesso=data.action
  }

  minusOreFerie(data:any) {
    this.rimanezaFerie=data.action
  }

  protected loading:boolean=false;

  caricaGiustificativi() {
    const formData: FormData = new FormData();
    formData.append('file', this.fileUploadForm.get('uploadFile')?.value);
    this.loading=true
    this.subs.sink= this.impiegatoService.submitGiustificativoTimesheet(this.timesheet.id, formData).subscribe({
      next: (res) => {
        Swal.fire('Giustificativi Caricati com successo!', 'sono stati caricati dei giustificativi per questo timesheet', 'success');
      },
      error: (res) => {
        Swal.fire('Ops Qualcosa è andato storto', '', 'error');
      },
      complete: () => {
        this.loading=false
      }
    });
  }
}
