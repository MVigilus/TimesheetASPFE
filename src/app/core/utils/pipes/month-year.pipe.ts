import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  standalone: true,
  name: 'monthYear'
})
export class MonthYearPipe implements PipeTransform {

  transform(value: string): string|null {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'MM-yyyy');
  }

}
