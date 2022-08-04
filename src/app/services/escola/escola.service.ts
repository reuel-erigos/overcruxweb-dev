import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { Escola } from '../../core/escola';

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
}
