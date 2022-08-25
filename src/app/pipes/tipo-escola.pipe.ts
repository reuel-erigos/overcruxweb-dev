import { Pipe, PipeTransform } from '@angular/core';
  
@Pipe({
  name: 'tipoEscola'
})
export class TipoEscolaPipe implements PipeTransform {
  transform(value: any): any {
    if(value) {
      if(value === 'P') {
        return 'Pública';
      } else if(value === 'R') {
        return 'Privada';
      }
    }
    return '';
  }
}