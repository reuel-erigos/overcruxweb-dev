import { Movimentacoes } from 'src/app/core/movimentacoes';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Rotas } from 'src/app/core/rotas';
import { DataUtilService } from '../commons/data-util.service';

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService extends BaseService<Movimentacoes> {

  constructor(http: HttpClient) {
    super(http, Rotas.MOVIMENTACOES);
  }

  getAllDestino() {
    return this.http.get(Rotas.MOVIMENTACOES + `destino`);
  }

  getAllOrigem() {
    return this.http.get(Rotas.MOVIMENTACOES + `origem`);
  }

  getFilterOrigem(idEmpresa: string|number,
                  idPrograma: string|number,
                  idProjeto: string|number,
                  valor: string|number,
                  dataInicioDoc: any,
                  dataFimDoc: any,
                  dataVencimento: any,
                  dataInicioMov: any,
                  dataFimMov: any,
                  numeroDocumento: string ) {

    idEmpresa       = idEmpresa || '';
    idPrograma      = idPrograma || '';
    idProjeto       = idProjeto || '';
    valor           = valor || '';
    numeroDocumento = numeroDocumento || '';

    const p_dataInicioDoc = dataInicioDoc ? dataInicioDoc.getTime() : '';
    const p_dataFimDoc = dataFimDoc ? dataFimDoc.getTime() : '';
    const p_dataVencimento = dataVencimento ? dataVencimento.getTime() : '';
    const p_dataInicioMov = dataInicioMov ? dataInicioMov.getTime() : '';
    const p_dataFimMov = dataFimMov ? dataFimMov.getTime() : '';

    return this.http.get(Rotas.MOVIMENTACOES + 'filter/origem', { params: {
        empresa: `${idEmpresa}` ,
        programa: `${idPrograma}` ,
        projeto: `${idProjeto}`,
        valor: `${valor}`,
        dataInicioDoc: `${p_dataInicioDoc}`,
        dataFimDoc: `${p_dataFimDoc}`,
        dataVencimento: `${p_dataVencimento}`,
        dataInicioMov: `${p_dataInicioMov}`,
        dataFimMov: `${p_dataFimMov}`,
        numeroDocumento: `${numeroDocumento}`,
        }
    });
  }

}
