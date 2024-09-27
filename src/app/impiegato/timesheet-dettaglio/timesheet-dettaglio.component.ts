import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {RouterOutlet} from "@angular/router";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {AuthService} from "@core";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {showNotification} from "@core/utils/functions";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {optionsAltro} from "@core/utils/options";

@Component({
  selector: 'app-timesheet-dettaglio',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    RouterOutlet,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    ReactiveFormsModule,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatInput,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect
  ],
  templateUrl: './timesheet-dettaglio.component.html',
  styleUrl: './timesheet-dettaglio.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class TimesheetDettaglioComponent extends UnsubscribeOnDestroyAdapter implements OnInit {




  @Input() timesheet:any;
  @Input() disableMargin!:boolean;
  @Input() rimanenzaPermesso!:number;
  @Input() rimanenzaFerie!:number;

  @Output() myEvent = new EventEmitter<any>();
  @Output() myEvent2 = new EventEmitter<any>();
  @Output() timesheetEvent = new EventEmitter<any>();
  @Output() orePermesso = new EventEmitter<any>();
  @Output() oreFerie = new EventEmitter<any>();

  emitEvent(data:any) {
    // Put the value/data you want to send to parent here.
    this.myEvent.emit(data);
  }

  emitEventEditKm(data:any) {
    // Put the value/data you want to send to parent here.
    this.myEvent2.emit(data);
  }

  emitTImesheet(data:any) {
    // Put the value/data you want to send to parent here.
    this.timesheetEvent.emit(data);
  }

  displayedColumns: string[] = ['ngiorno', 'sede', 'clienteOre', 'straordinari', 'ferie', 'permessi', 'altro','tot'];
  dataSource!: MatTableDataSource<any>;
  timesheetForm:FormGroup;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private impiegatoService:ImpiegatoService,
              private authService:AuthService,
              private snackBar: MatSnackBar,
  ) {
    super();
    this.timesheetForm = this.fb.group({
      rows: this.fb.array([])
    });
  }

  get currentUser(){
    return this.authService.currentUserValue;
  }

  timeValidator = (field: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {

      const group = control.parent as FormGroup;
      if (!group) return null;

      let total = 0;
      ['sede','clienteOre','ferie','permessi'].forEach(fieldName => {
        const fieldControl = group.get(fieldName);
        if (fieldControl && fieldControl.value !== null && fieldControl.value !== '' && !isNaN(+fieldControl.value)){
          total += +fieldControl.value;
        }
      });

      return total > this.currentUser.oreLavorative ? { 'exceedTime': true } : null;
    };
  };

  maxWorkHoursValidator = (maxHours: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {

      // Check if the control's value exists and is a number
      if (control.value && !isNaN(+control.value) && control.value !== null && control.value !== '') {

        // Returns an error if the condition is true
        if (+control.value > maxHours) {
          return { 'exceededPermessi': true };
        }
      }

      // If the control's value is valid, return null
      return null;
    };
  };

  validatorPermessi=(): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {

      // Check if the control's value exists and is a number
      if (control.value && !isNaN(+control.value) && control.value !== null && control.value !== '') {

        // Returns an error if the condition is true
        if ((this.rimanenzaPermesso-control.value)<0) {
          return { 'exceededPermessi': true };
        }
      }

      // If the control's value is valid, return null
      return null;
    };
  };

  validatorFerie=(): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {

      // Check if the control's value exists and is a number
      if (control.value && !isNaN(+control.value) && control.value !== null && control.value !== '') {

        // Returns an error if the condition is true
        if ((this.rimanenzaFerie-control.value)<0) {
          return { 'exceededFerie': true };
        }
      }

      // If the control's value is valid, return null
      return null;
    };
  };

  private kmPholder:number[]=[]

  ngOnInit(): void {
    if(this.currentUser.rimborso){
      this.displayedColumns.push(...['clienteDest', 'destinazione', 'kmP'])
    }
    const rowFormArray = this.timesheetForm.controls['rows'] as FormArray;
    let totR=this.rimanenzaFerie
    let totP= this.rimanenzaPermesso
    this.timesheet.datiTimesheet.forEach((rowData:any) => {
      const rowFormGroup = this.fb.group({});
      let totkm=0;
      let tot =0;

      Object.keys(rowData).forEach(fieldName => {
        const control = this.fb.control(rowData[fieldName], [(fieldName!='straordinari')?this.timeValidator(fieldName):this.maxWorkHoursValidator(this.authService.currentUserValue.oreLavorative)]);
        //control.addValidators((fieldName==='permessi')?[this.validatorPermessi()]:(fieldName==='ferie')?[this.validatorFerie()]:[])
        rowFormGroup.addControl(fieldName, control);
        if(['sede','clienteOre','straordinari','ferie','permessi','altro'].includes(fieldName)){
          if(fieldName==='altro'){
            tot+=(rowData[fieldName]!='')?this.authService.currentUserValue.oreLavorative:0;
          }else{
            if(['ferie','permessi'].includes(fieldName)){
              if(fieldName==='ferie'){
                totR-=Number(rowData[fieldName])||0
              }
              else if(fieldName==='permessi'){
                totP-=Number(rowData[fieldName])||0
              }

            }
            tot+=Number(rowData[fieldName])||0;
          }
        }
      });
      totkm+=Number(rowData["kmP"]) || 0;
      this.kmPholder.push(Number(rowData["kmP"]) || 0)
      this.emitEvent({"km":totkm})
      rowFormGroup.addControl('tot',this.fb.control(tot))
      rowFormArray.push(rowFormGroup);
    });
    this.oreFerie.emit({"action":totR})
    this.orePermesso.emit({"action":totP})

    this.dataSource = new MatTableDataSource((this.timesheetForm.get('rows') as FormArray).controls);
  }

  updateField(rowIndex:any, fieldName:any) {
    const rowFormGroup = (this.timesheetForm.controls['rows'] as FormArray).at(rowIndex) as FormGroup;

    if (rowFormGroup.controls[fieldName].valid) {
      let total = 0;
      let strd=false;

      if(fieldName=='altro'){
        const altroControl = rowFormGroup.controls['altro'];
        if (altroControl && altroControl.value === '2') {
          ['sede','clienteOre','ferie','permessi','clienteDest', 'destinazione', 'kmP'].forEach(name => {
            const control = rowFormGroup.controls[name];
            if (control) {
              control.setValue('');
              control.disable();
            }
          });
          total=0
        } else if(altroControl.value!=' ' && altroControl.value!=''){
          ['sede','clienteOre','straordinari','ferie','permessi','clienteDest', 'destinazione', 'kmP'].forEach(name => {
            const control = rowFormGroup.controls[name];
            if (control) {
              control.setValue('');
              control.disable();
            }
          });
          total+=8;
        } else {
          ['sede','clienteOre','straordinari','ferie','permessi','clienteDest', 'destinazione', 'kmP'].forEach(name => {
            const control = rowFormGroup.controls[name];
            if (control) {
              control.enable();
            }
          });
          altroControl.setValue('')
          total=0;
        }
      } else if(fieldName=='kmP'){
        ['sede','clienteOre','straordinari','ferie','permessi'].forEach(name => {

          const control = rowFormGroup.controls[name];
          if (control && control.value !== null && control.value !== '' && !isNaN(+control.value)) {
            total += Number(control.value);
          }
        });
        const kmPoControl = rowFormGroup.controls['kmP'];
        this.emitEventEditKm({"km":this.kmPholder[rowIndex]})
        this.kmPholder[rowIndex]=Number(kmPoControl.value)||0;
        this.emitEvent({"km":Number(kmPoControl.value)||0})
      } else {
        const control = rowFormGroup.controls[fieldName];

        switch (fieldName){
          case 'permessi':
            if (control && control.value !== null && control.value !== '' && !isNaN(+control.value)) {
              this.rimanenzaPermesso-=control.value
            }else{
              this.rimanenzaPermesso=this.authService.currentUserValue.anagraficaLavorativa[0].giorniPermesso
              this.timesheetForm.controls['rows'].value.forEach((value:any)=>{
                this.rimanenzaPermesso-=Number(value.permessi)||0
              })
            }
            this.orePermesso.emit({"action":this.rimanenzaPermesso})
            break;
          case 'ferie':
            if (control && control.value !== null && control.value !== '' && !isNaN(+control.value)) {
              this.rimanenzaFerie-=control.value
            }else {
              this.rimanenzaFerie=this.authService.currentUserValue.anagraficaLavorativa[0].giorniFerie
              this.timesheetForm.controls['rows'].value.forEach((value:any)=>{
                this.rimanenzaFerie-=Number(value.ferie)||0
              })
            }
            this.oreFerie.emit({"action":this.rimanenzaFerie})
            break;
        }
        ['sede','clienteOre','straordinari','permessi','ferie','altro'].forEach(name => {

          const control = rowFormGroup.controls[name];
          if(name=='straordinari'){
            strd=true;
            if (control && control.value !== null && control.value !== '' && !isNaN(+control.value)) {
              total += Number(control.value);
            }
          }else if(name!='altro'){
            if (control && control.value !== null && control.value !== '' && !isNaN(+control.value)) {
              total += Number(control.value);
            }
          }else if (control.value !== ''){
            total+=this.authService.currentUserValue.oreLavorative
          }

        });

      }

      this.emitTImesheet({"dato":(['clienteDest', 'destinazione'].includes(fieldName))?rowFormGroup.controls[fieldName].value:Number(rowFormGroup.controls[fieldName].value),"field":fieldName,"index":rowIndex})

      const totControl = rowFormGroup.controls['tot'];
      if ((totControl && !(total>this.currentUser.oreLavorative)) || strd) {
        totControl.setValue(total);
      }

    } else{
      if(['exceededPermessi','exceededFerie'].includes(Object.keys(rowFormGroup.controls[fieldName].errors||{})[0])){
        showNotification('red','Ore Permesso/Ferie Superate','top','center',this.snackBar)
      }else{
        showNotification('red','Raggiunto Limite Ore Lavorative Giornaliere','top','center',this.snackBar)
      }
      rowFormGroup.controls[fieldName].setValue('');
    }
  }

  isDisabled(element: any): boolean {
    const disabled = element.get('altro').value === 'FES';
    console.log(`input isDisabled = ${disabled}`);
    return disabled;
  }


  JSON = JSON;

  protected readonly optionsAltro = optionsAltro;
}
