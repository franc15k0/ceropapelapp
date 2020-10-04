import { Pipe, PipeTransform } from '@angular/core';
import { Registro } from '../../model/registro.model';
/**
 * A simple string filter, since Angular does not yet have a filter pipe built in.
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (arg === '' || arg.length < 2) return value;

    return value.filter((item) => item.idRegistro === parseInt(arg));
  }
}
