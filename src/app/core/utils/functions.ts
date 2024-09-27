import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import Swal from "sweetalert2";
import {TipoNotifica} from "@core/models/Notifications";

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


export function dateAfterTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();

    // Reset hours, minutes, seconds, and milliseconds to 0 for comparison
    today.setHours(0, 0, 0, 0);

    if (inputDate && inputDate <= today) {
      return { dateInvalid: 'The date must be after today\'s date' };
    }

    return null;
  };
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

export function timeDifferenceInMinutes(givenDate: Date): string {
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

  return `${differenceInMinutes} minuti fa`;
}

// Function to get icon based on notification type
export function iconForNotificationConverte(tipo: TipoNotifica): string {
  switch (tipo) {
    case TipoNotifica.INSERT_TIMESHEET:
      return 'insert_chart';
    case TipoNotifica.SEND_TIMESHEET:
      return 'send';
    case TipoNotifica.INSERT_GIUSTIFICATIVO:
      return 'insert_drive_file';
    case TipoNotifica.INSERT_BUSTA_PAGA:
      return 'attach_money';
    case TipoNotifica.TIMESHEET_APPROVED:
      return 'check_circle';
    case TipoNotifica.TIMESHEET_REJECTED:
      return 'cancel';
    case TipoNotifica.RESETTED_PASSWORD:
      return 'lock_reset';
    default:
      return 'notifications';
  }
}

// Function to get color based on notification type
export function colorForNotificationConverte(tipo: TipoNotifica): string {
  switch (tipo) {
    case TipoNotifica.INSERT_TIMESHEET:
      return 'blue';
    case TipoNotifica.SEND_TIMESHEET:
      return 'purple';
    case TipoNotifica.INSERT_GIUSTIFICATIVO:
      return 'orange';
    case TipoNotifica.INSERT_BUSTA_PAGA:
      return 'green';
    case TipoNotifica.TIMESHEET_APPROVED:
      return 'green';
    case TipoNotifica.TIMESHEET_REJECTED:
      return 'red';
    case TipoNotifica.RESETTED_PASSWORD:
      return 'yellow';
    default:
      return 'grey';
  }
}
