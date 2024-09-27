import {Component, Inject, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {DialogData} from "@core/models/dialogData.model";
import {AdvanceTableService} from "@core/service/advance-table.service";
import {AsyncPipe, formatDate} from "@angular/common";
import {ImpiegatoDto, Ruolo} from "@core/models/admin/ImpiegatoDto.model";
import {convertImpiegatolistToImpiegatoDto} from "@core/converters/ImpiegatoDtoConverter.converter";
import {AdminService} from "@core/service/admin.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {RoleFormatPipe} from "@core/utils/pipes/RoleFormatPipe.pipe";
import {dateAfterTodayValidator} from "@core/utils/functions";

@Component({
  selector: 'app-impiegato-form-component',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    MatNativeDateModule,
    MatMomentDateModule,
    AsyncPipe,
    RoleFormatPipe
  ],
  templateUrl: './impiegato-form-component.component.html',
  styleUrl: './impiegato-form-component.component.scss'
})
export class ImpiegatoFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit{
  action: string;
  dialogTitle: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable!: ImpiegatoDto;
  constructor(
    public dialogRef: MatDialogRef<ImpiegatoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: AdvanceTableService,
    private fb: UntypedFormBuilder,
    private adminService:AdminService
  ) {
    super();
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Scheda impiegato : '+
        data.advanceTable.nominativo;
      this.advanceTable = convertImpiegatolistToImpiegatoDto(data.advanceTable);
    } else {
      this.dialogTitle = 'Nuovo Impiegato';
      this.advanceTable = {
        id:null,
        username: '',
        email: '',
        role: Ruolo.ROLE_USER,
        codiceFisc: '',
        nominativo: '',
        telefono: '',
        dataAss: new Date().toDateString(),
        rimborso: false,
        giorni_permesso: 0,
        giorni_ferie: 0,
        giorni_ferie_pr: 0,
        giorni_permesso_pr: 0,
        modello_auto: '',
        rimborsoKm: 0,
        oreLavorative: 0
      };
    }
    this.advanceTableForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo richiesto'
      : this.formControl.hasError('email')
        ? 'Email non valida'
        : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id:[this.advanceTable.id],
      username: [this.advanceTable.username, []],
      email: [
        this.advanceTable.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      role: [this.advanceTable.role, [Validators.required]],
      codiceFisc: [this.advanceTable.codiceFisc, [Validators.required,Validators.pattern('^[A-Z]{6}[0-9]{2}[A-EHLMPR-T]{1}[0-9]{2}[A-Z0-9]{4}[A-Z]{1}$')]],
      nominativo: [this.advanceTable.nominativo, [Validators.required]],
      telefono: [this.advanceTable.telefono],
      dataAss: [
        new Date(this.advanceTable.dataAss),
        [Validators.required,dateAfterTodayValidator.bind(this)],
      ],
      rimborso: [this.advanceTable.rimborso, [Validators.required]],
      giorni_permesso: [this.advanceTable.giorni_permesso, [Validators.required]],
      giorni_ferie: [this.advanceTable.giorni_ferie, [Validators.required]],
      giorni_ferie_pr: [this.advanceTable.giorni_ferie_pr, [Validators.required]],
      giorni_permesso_pr: [this.advanceTable.giorni_permesso_pr, [Validators.required]],
      modello_auto: [this.advanceTable.modello_auto],
      rimborsoKm: [this.advanceTable.rimborsoKm],
      oreLavorative: [this.advanceTable.oreLavorative, [Validators.required]],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    if(this.action==='edit'){
      this.advanceTableService.updateAdvanceTable(
        this.advanceTableForm.getRawValue()
      ).subscribe({
        next: (data) => {
          this.dialogRef.close(1);
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire('Ops Qualcosa è andato storto', '', 'error');
          this.dialogRef.close();
        },
      });
    }else{
      this.advanceTableService.addAdvanceTable(
        this.advanceTableForm.getRawValue()
      ).subscribe({
        next: (data) => {
          this.dialogRef.close(1);
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire('Ops Qualcosa è andato storto', '', 'error');
          this.dialogRef.close();
        },
      });
    }


  }

  protected ruoli!:any;

  ngOnInit(): void {
    this.subs.sink=this.adminService.getAllRole().subscribe((response) => {
      this.ruoli = response;
    });
  }

   JSON = JSON;
}
