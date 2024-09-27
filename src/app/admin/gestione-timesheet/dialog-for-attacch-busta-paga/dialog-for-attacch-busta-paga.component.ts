import {Component, Inject, Input} from '@angular/core';
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {MatButton} from "@angular/material/button";
import {MatLabel} from "@angular/material/form-field";
import {FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {AdminService} from "@core/service/admin.service";
import Swal from "sweetalert2";
import {FileSystemService} from "@core/service/file-system.service";

@Component({
  selector: 'app-dialog-for-attacch-busta-paga',
  standalone: true,
  imports: [
    FileUploadComponent,
    MatButton,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-for-attacch-busta-paga.component.html',
  styleUrl: './dialog-for-attacch-busta-paga.component.scss'
})
export class DialogForAttacchBustaPagaComponent extends UnsubscribeOnDestroyAdapter {

  timesheet:any;

  fileUploadForm: UntypedFormGroup;

  constructor(
              private fileService:FileSystemService,
              private fb:FormBuilder,public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
    this.fileUploadForm = this.fb.group({
      uploadFile: ['',[Validators.required]],
    });
    this.timesheet=data.timesheet;
  }

  AllegaBustaPaga(){
    const formData: FormData = new FormData();
    formData.append('file', this.fileUploadForm.get('uploadFile')?.value);
    this.subs.sink= this.fileService.submitBustaPagaTimesheet(this.timesheet.idTimesheet, formData).subscribe({
      next:(res)=>{
        Swal.fire('Busta Paga Inviata!', 'è stato allegato una busta paga ', 'success');
      },
      error:(res)=>{
        Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');
      },
      complete: () => {
        this.dialog.closeAll();
        console.log('File upload complete');
      }
    });
  }


}
