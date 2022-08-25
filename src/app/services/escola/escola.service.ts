import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { Escola } from '../../core/escola';
import { PageInfo } from '../../core/page-info';
import { FiltroEscola } from '../../core/filtro/filtro-escola';

@Injectable({
  providedIn: 'root'
})
export class EscolaService extends BaseService<Escola> {

  constructor(http: HttpClient) {
    super(http, Rotas.ESCOLA);
  }

  getAllEscolasByCombo(tipo: string) {
    return this.http.get(`${Rotas.ESCOLA}dados/combo/${tipo}`);
  }

  listFilteredAndPaged(pageInfo: PageInfo, filtro: FiltroEscola) {
    return this.http.post(
      Rotas.ESCOLA + 'paged/filtro', 
      JSON.stringify(filtro),
      this.headersWithPagination(pageInfo)
    );
  }
}
