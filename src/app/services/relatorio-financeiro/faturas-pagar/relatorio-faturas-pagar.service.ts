import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HTTP_BYPASS_INTERCEPTOR } from 'src/app/components/common/http-mgmt/http-mgmt.module';


const rootPath = 'api/faturaspagar/';

@Injectable({
  providedIn: 'root'
})
export class RelatorioFaturasPagarService {

  constructor(private http: HttpClient,
    @Inject(HTTP_BYPASS_INTERCEPTOR) private httpBypassInterceptor: HttpClient) {
  }

  showRelatorio(mimetype, dados: any[]): any {
    return this.http.post(`${rootPath}mimetype/${mimetype}`, dados, { responseType: 'arraybuffer' });
  }



  getFilter(idcategoria: string | number,
    idEmpresa: string | number,
    idPessoaFisica: string | number,
    idPrograma: string | number,
    idProjeto: string | number,
    dataInicio: any,
    dataFim: any,
    dataInicioVenc: any,
    dataFimVenc: any) {

    idcategoria = idcategoria || '';
    idEmpresa = idEmpresa || '';
    idPessoaFisica = idPessoaFisica || '';
    idPrograma = idPrograma || '';
    idProjeto = idProjeto || '';

    const p_dataInicio = dataInicio ? dataInicio.getTime() : '';
    const p_dataFim = dataFim ? dataFim.getTime() : '';
    const p_dataInicioVenc = dataInicioVenc ? dataInicioVenc.getTime() : '';
    const p_dataFimVenc = dataFimVenc ? dataFimVenc.getTime() : '';

    return this.http.get(`${rootPath}filter`, {
      params: {
        idcategoria: `${idcategoria}`,
        idempresa: `${idEmpresa}`,
        idpessoafisica: `${idPessoaFisica}`,
        idprograma: `${idPrograma}`,
        idprojeto: `${idProjeto}`,
        dataInicio: `${p_dataInicio}`,
        dataFim: `${p_dataFim}`,
        dataInicioVenc: `${p_dataInicioVenc}`,
        dataFimVenc: `${p_dataFimVenc}`
      }
    });
  }

  getFilterView(idcategoria: string | number,
    idEmpresa: string | number,
    idPessoaFisica: string | number,
    idPrograma: string | number,
    idProjeto: string | number,
    dataInicio: any,
    dataFim: any,
    dataInicioVenc: any,
    dataFimVenc: any) {

    idcategoria = idcategoria || '';
    idEmpresa = idEmpresa || '';
    idPessoaFisica = idPessoaFisica || '';
    idPrograma = idPrograma || '';
    idProjeto = idProjeto || '';

    const p_dataInicio = dataInicio ? dataInicio.getTime() : '';
    const p_dataFim = dataFim ? dataFim.getTime() : '';
    const p_dataInicioVenc = dataInicioVenc ? dataInicioVenc.getTime() : '';
    const p_dataFimVenc = dataFimVenc ? dataFimVenc.getTime() : '';

    return this.http.get(`${rootPath}filter/view`, {
      params: {
        idcategoria: `${idcategoria}`,
        idempresa: `${idEmpresa}`,
        idpessoafisica: `${idPessoaFisica}`,
        idprograma: `${idPrograma}`,
        idprojeto: `${idProjeto}`,
        dataInicio: `${p_dataInicio}`,
        dataFim: `${p_dataFim}`,
        dataInicioVenc: `${p_dataInicioVenc}`,
        dataFimVenc: `${p_dataFimVenc}`
      }
    });
  }

}
