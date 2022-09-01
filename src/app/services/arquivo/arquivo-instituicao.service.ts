import { Cacheable } from 'ngx-cacheable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArquivoMetadados } from '../../core/arquivo-metadado';
import { BaseService } from '../base/base.service';
import { PageInfo } from '../../core/page-info';
import { FiltroArquivo } from '../../core/filtro/filtro-arquivo';

const rootPath = 'api/arquivoinstituicao/';

const httpOptions = {
  'responseType'  : 'arraybuffer' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class ArquivoInstituicaoService {

  constructor(private http: HttpClient) { }

  gravar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(rootPath, formData);
  }

  gravarComIdInstituicao(file: File, id: number) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${rootPath}/instituicao/${id}`, formData);
  }

  alterar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(rootPath, formData);
  }

  alterarComIdInstituicao(file: File, id: number) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${rootPath}/instituicao/${id}`, formData);
  }

  gravarComIdInstituicaoTipo(file: File, tipo: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${rootPath}/instituicao/tipo/${tipo}`, formData);
  }

  get(id: number) {
    return this.http.get(rootPath + `${id}`, httpOptions);
  }

  listFilteredAndPaged(pageInfo: PageInfo, filtro: FiltroArquivo) {
    return this.http.post(
      rootPath + 'paged/filtro', 
      JSON.stringify(filtro),
      this.headersWithPagination(pageInfo)
    );
  }

  private headersWithPagination(pageInfo: PageInfo) {
    return {headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'page': pageInfo.actualPage.toString(),
      'pageSize': pageInfo.pageSize.toString(),
    })};
  }
}



