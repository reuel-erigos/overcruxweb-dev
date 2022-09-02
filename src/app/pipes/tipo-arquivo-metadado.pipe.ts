import { Pipe, PipeTransform } from '@angular/core';
import { TipoAquivoMetadado } from '../core/enum/tipo-arquivo-metadado.enum';
  
@Pipe({
  name: 'tipoArquivoMetadado'
})
export class TipoArquivoMetadadoPipe implements PipeTransform {
  transform(value: any): any {
    if(value) {
      if(value === TipoAquivoMetadado.CABECALHO_RELATORIO) {
        return 'Cabeçalho do Relatório';
      } else if(value === TipoAquivoMetadado.RODAPE_RELATORIO) {
        return 'Rodapé do Relatório';
      } else if(value === TipoAquivoMetadado.LOGOMARCA_INSTITUICAO) {
        return 'Logomarca da Instituição';
      } else if(value === TipoAquivoMetadado.LOGOMARCA_UNIDADE) {
        return 'Logomarca da Unidade';
      }
    }
    return '';
  }
}