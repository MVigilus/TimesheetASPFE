import {Component, Inject, Input, OnInit} from '@angular/core';
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {MatButton} from "@angular/material/button";
import {MatLabel} from "@angular/material/form-field";
import {FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {ImpiegatoService} from "@core/service/impiegato.service";
import {MatInput} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {FileSystemService} from "@core/service/file-system.service";

@Component({
  selector: 'app-dialog-for-attach-files',
  standalone: true,
  imports: [
    FileUploadComponent,
    MatButton,
    MatLabel,
    ReactiveFormsModule,
    MatInput
  ],
  templateUrl: './dialog-for-attach-files.component.html',
  styleUrl: './dialog-for-attach-files.component.scss'
})
export class DialogForAttachFilesComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  giustificativofileUploadForm: UntypedFormGroup;
  fileUploadForm: UntypedFormGroup;
  private idTimesheet!:number;

  constructor(private fileService:FileSystemService,
              private fb:FormBuilder,public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
    this.fileUploadForm = this.fb.group({
      uploadFile: ['',[Validators.required]],
    });
    this.giustificativofileUploadForm = this.fb.group({
      uploadFile: ['',[Validators.required]],
      comment: [''],
    });
    this.idTimesheet=data.timesheet;
  }

  AllegaGius() {
    const formData: FormData = new FormData();
    formData.append('file', this.giustificativofileUploadForm.get('uploadFile')?.value);
    this.subs.sink= this.fileService.submitGiustificativoTimesheet(this.idTimesheet, formData).subscribe({
      next: (res) => {
        Swal.fire('Giustificiativo Inviato!', 'è stato allegato un giustificativo ', 'success');

      },
      error: (res) => {
        Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');

      },
      complete: () => {
        this.dialog.closeAll();
        console.log('File upload complete');
      }
    });


  }


  AllegaFile() {
    const formData: FormData = new FormData();
    formData.append('file', this.fileUploadForm.get('uploadFile')?.value);
    this.subs.sink= this.fileService.submitAllegatoTimesheet(this.idTimesheet, formData, this.fileUploadForm.get('comment')?.value).subscribe({
      next: (res) => {
        Swal.fire('File Inviata!', 'è stato allegato un file con successo ', 'success');

      },
      error: (res) => {
        Swal.fire('Errore Generico', 'Si prega di contattare l\'amministratore ', 'error');

      },
      complete: () => {
        this.dialog.closeAll();
        console.log('File upload complete');
      }
    });


  }

  ngOnInit(): void {
  }

}
