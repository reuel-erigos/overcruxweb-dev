import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { RegiaoAdministrativa } from '../../core/regiao-administrativa';
import { PageInfo } from '../../core/page-info';
import { FiltroRegiaoAdministrativa } from '../../core/filtro/filtro-regiao-administrativa';

@Injectable({
  providedIn: 'root'
})
export class RegiaoAdministrativaService extends BaseService<RegiaoAdministrativa> {

  constructor(http: HttpClient) {
    super(http, Rotas.REGIAO_ADMINISTRATIVA);
  }

  listFilteredAndPaged(pageInfo: PageInfo, filtro: FiltroRegiaoAdministrativa) {
    return this.http.post(
      Rotas.REGIAO_ADMINISTRATIVA + 'paged/filtro', 
      JSON.stringify(filtro),
      this.headersWithPagination(pageInfo)
    );
  }
}
