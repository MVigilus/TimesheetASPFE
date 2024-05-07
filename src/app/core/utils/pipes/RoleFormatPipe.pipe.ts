import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'roleFormat'
})
export class RoleFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    if (value === 'ROLE_USER') {
      return 'Impiegato';
    }

    return value.replace('ROLE_', '');
  }

}
