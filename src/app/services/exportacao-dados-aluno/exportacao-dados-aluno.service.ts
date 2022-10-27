import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExportacaoDadosAluno } from 'src/app/core/exportacao-dados-aluno';
import { ListaCompletaDadosExportar } from 'src/app/core/lista-completa-dados-exportar';
import { Rotas } from 'src/app/core/rotas';
import { FiltroExportacao } from '../../core/filtro/filtro-exportacao';
import { BaseService } from '../base/base.service';

const httpOptions = {
  'responseType'  : 'arraybuffer' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class ExportacaoDadosAlunoService  extends BaseService<ExportacaoDadosAluno> {

  constructor(http: HttpClient) {
    super(http, Rotas.EXPORTAR_DADOS_ALUNO);
  }


  gerarArquivo(lista: ListaCompletaDadosExportar) {
    return this.http.post(Rotas.EXPORTAR_DADOS_ALUNO + "gerar-arquivo", lista, httpOptions);
  }

  getFilter(cpf: string|number,
            idBeneficiario: string|number,
            idMae: string|number,
            idPai: string|number,
            idPrograma: string|number,
            idProjeto: string|number,
            idUnidade: string|number,
            idResponsavel: string|number,
            dataInicioEntradaInstituicao: any,
            dataFimEntradaInstituicao: any,
            dataInicioVigenciaInstituicao: any,
            dataFimVigenciaInstituicao: any,) {

    cpf             = cpf || '';
    idBeneficiario  = idBeneficiario || '';
    idMae           = idMae || '';
    idPai           = idPai || '';
    idPrograma      = idPrograma || '';
    idProjeto       = idProjeto || '';
    idUnidade       = idUnidade || '';
    idResponsavel   = idResponsavel || '';

    const p_dataInicioEntradaInstituicao = dataInicioEntradaInstituicao ? dataInicioEntradaInstituicao.getTime() : '';
    const p_dataFimEntradaInstituicao = dataFimEntradaInstituicao ? dataFimEntradaInstituicao.getTime() : '';
    const p_dataInicioVigenciaInstituicao = dataInicioVigenciaInstituicao ? dataInicioVigenciaInstituicao.getTime() : '';
    const p_dataFimVigenciaInstituicao = dataFimVigenciaInstituicao ? dataFimVigenciaInstituicao.getTime() : '';

    return this.http.get(Rotas.EXPORTAR_DADOS_ALUNO + 'filter', { params: {
      cpf: `${cpf}` ,
      idBeneficiario: `${idBeneficiario}` ,
      idMae: `${idMae}`,
      idPai: `${idPai}`,
      idPrograma: `${idPrograma}`,
      idProjeto: `${idProjeto}`,
      idUnidade: `${idUnidade}`,
      dataInicioEntradaInstituicao: `${p_dataInicioEntradaInstituicao}`,
      dataFimEntradaInstituicao: `${p_dataFimEntradaInstituicao}`,
      dataInicioVigenciaInstituicao: `${p_dataInicioVigenciaInstituicao}`,
      dataFimVigenciaInstituicao: `${p_dataFimVigenciaInstituicao}`,
      }
    });
  }

  listFiltered(filtro: FiltroExportacao) {
    return this.http.post(
      Rotas.EXPORTAR_DADOS_ALUNO + 'filtro', 
      JSON.stringify(filtro),
      this.headers()
    );
  }

}
