import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Rotas } from 'src/app/core/rotas';
import { TiposContratos } from 'src/app/core/tipos-contratos';

@Injectable({
  providedIn: 'root'
})
export class TiposContratosService extends BaseService<TiposContratos> {

  constructor(http: HttpClient) {
    super(http, Rotas.TIPOS_CONTRATOS);
  }

}
