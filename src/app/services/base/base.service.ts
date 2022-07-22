import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageInfo } from '../../core/page-info';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

export class BaseService<T> {

  constructor(public http: HttpClient,
              public rota: string) {
  }

  getAll() {
    return this.http.get(`${this.rota}`);
  }
  
  getAllCombo() {
    return this.http.get(`${this.rota}combo`);
  }

  getById(id: number) {
    return this.http.get(`${this.rota}${id}`);
  }

  cadastrar(param: T) {
    return this.http.post(`${this.rota}`, param);
  }

  alterar(param: T) {
    return this.http.put(`${this.rota}`, param);
  }

  excluir(id: number) {
    return this.http.delete(`${this.rota}${id}`);
  }

  protected headersWithPagination(pageInfo: PageInfo) {
    return {headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'page': pageInfo.actualPage.toString(),
      'pageSize': pageInfo.pageSize.toString(),
    })};
  }
}
