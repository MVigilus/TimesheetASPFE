import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

export function showNotification(
  colorName: string,
  text: string,
  placementFrom: MatSnackBarVerticalPosition,
  placementAlign: MatSnackBarHorizontalPosition,
  snackBar: MatSnackBar
) {
  snackBar.open(text, '', {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName,
  });
}

export function confirmModal(title:string, text:string){
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Conferma',
    })
}

export function dateLessThan(from: string, to: string) {
  return (group: FormGroup): { [key: string]: any } => {
    let f = group.controls[from];
    let t = group.controls[to];
    if (f.value && t.value && f.value > t.value) {
      return {
        dates: "Data A dovrebbe essere dopo di Data Da"
      };
    }
    return {};
  };
}
