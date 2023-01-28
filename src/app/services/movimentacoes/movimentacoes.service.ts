import { Movimentacoes } from 'src/app/core/movimentacoes';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Rotas } from 'src/app/core/rotas';
import { FilterMovimentacoes } from 'src/app/core/filter-movimentacoes';
import { PageInfo } from '../../core/page-info';

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService extends BaseService<Movimentacoes> {

  filtro: FilterMovimentacoes = new FilterMovimentacoes();

  constructor(http: HttpClient) {
    super(http, Rotas.MOVIMENTACOES);
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
                  dataInicioPag: any,
                  dataFimPag: any,
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
    const p_dataInicioPag = dataInicioPag ? dataInicioPag.getTime() : '';
    const p_dataFimPag = dataFimPag ? dataFimPag.getTime() : '';


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
        dataInicioPag: `${p_dataInicioPag}`,
        dataFimPag: `${p_dataFimPag}`,        
        numeroDocumento: `${numeroDocumento}`,
        }
    });
  }


  getFilterTransferenciaValores(idContaBanciariaOrigem: string|number,
                                idContaBanciariaDestino: string|number,
                                valor: string|number,
                                data: any) {

    idContaBanciariaOrigem       = idContaBanciariaOrigem || '';
    idContaBanciariaDestino      = idContaBanciariaDestino || '';
    valor                        = valor || '';

    const p_data = data ? data.getTime() : '';


    return this.http.get(Rotas.MOVIMENTACOES + 'filter/transferenciavalores', { params: {
        contaorigem: `${idContaBanciariaOrigem}` ,
        contadestico: `${idContaBanciariaDestino}` ,
        valor: `${valor}`,
        data: `${p_data}`,
        }
    });
  }

  listFilteredAndPaged(pageInfo: PageInfo, filtro: FilterMovimentacoes) {
    return this.http.post(
      Rotas.MOVIMENTACOES + 'paged/filtro', 
      JSON.stringify(filtro),
      this.headersWithPagination(pageInfo)
    );
  }
}
