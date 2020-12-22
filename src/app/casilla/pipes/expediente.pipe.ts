import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterExp',
})
export class ExpedientePipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (arg === '' || arg.length < 2) return value;

    return value.filter((item) => item.idExpediente === parseInt(arg));
  }
}
