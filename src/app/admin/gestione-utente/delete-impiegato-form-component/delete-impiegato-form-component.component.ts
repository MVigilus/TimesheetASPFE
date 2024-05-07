import {Component, Inject} from '@angular/core';
import {AdvanceTableService} from "@core/service/advance-table.service";
import {DialogData} from "@core/models/dialogData.model";
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-delete-impiegato-form-component',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './delete-impiegato-form-component.component.html',
  styleUrl: './delete-impiegato-form-component.component.scss'
})
export class DeleteImpiegatoFormComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteImpiegatoFormComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(JSON.stringify(data))
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
